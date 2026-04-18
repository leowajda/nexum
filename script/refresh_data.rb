#!/usr/bin/env ruby
# frozen_string_literal: true

require "fileutils"
require "open3"
require "pathname"
require "yaml"

module RefreshData
  ROOT = File.expand_path("..", __dir__)
  SITE_SOURCE = File.join(ROOT, "site-src")
  COLLECTIONS_DIRECTORY = File.join(SITE_SOURCE, "collections")
  LEGACY_COLLECTIONS_DIRECTORY = File.join(SITE_SOURCE, "_collections")
  PROJECT_COLLECTIONS_DIRECTORY = File.join(COLLECTIONS_DIRECTORY, "_projects")
  LEGACY_GENERATED_MANIFEST_PATH = File.join(SITE_SOURCE, ".generated-files.json")
  GENERATED_DIRECTORIES = [
    File.join(COLLECTIONS_DIRECTORY, "_eureka_indexes"),
    File.join(COLLECTIONS_DIRECTORY, "_eureka_languages"),
    File.join(COLLECTIONS_DIRECTORY, "_eureka_problems"),
    File.join(COLLECTIONS_DIRECTORY, "_eureka_implementations"),
    File.join(COLLECTIONS_DIRECTORY, "_source_languages"),
    File.join(COLLECTIONS_DIRECTORY, "_source_modules"),
    File.join(COLLECTIONS_DIRECTORY, "_source_documents"),
    File.join(SITE_SOURCE, "_data", "generated"),
    File.join(SITE_SOURCE, "assets", "generated"),
    LEGACY_COLLECTIONS_DIRECTORY
  ].freeze

  module Helpers
    module_function

    def read_text(path)
      File.read(path)
    rescue StandardError => error
      raise "Unable to read '#{path}': #{error.message}"
    end

    def maybe_read_text(path)
      File.exist?(path) ? read_text(path) : ""
    end

    def write_text(path, content)
      FileUtils.mkdir_p(File.dirname(path))
      File.write(path, content)
    end

    def copy_file(source_path, target_path)
      FileUtils.mkdir_p(File.dirname(target_path))
      FileUtils.cp(source_path, target_path)
    end

    def parse_yaml(raw, context)
      YAML.safe_load(raw, aliases: false) || {}
    rescue StandardError => error
      raise "#{context}: #{error.message}"
    end

    def ensure_hash(value, context)
      return value if value.is_a?(Hash)

      raise "#{context} must be a mapping"
    end

    def ensure_string(value, context)
      return value if value.is_a?(String)

      raise "#{context} must be a string"
    end

    def ensure_array(value, context)
      return value if value.is_a?(Array)

      raise "#{context} must be an array"
    end

    def ensure_boolean_or_nil(value, context)
      return value if value.nil? || value == true || value == false

      raise "#{context} must be a boolean"
    end

    def ensure_array_of_strings(value, context)
      unless value.is_a?(Array) && value.all? { |item| item.is_a?(String) }
        raise "#{context} must be an array of strings"
      end

      value
    end

    def normalize_remote_url(remote_url)
      if remote_url.start_with?("git@github.com:")
        return "https://github.com/#{remote_url.delete_prefix('git@github.com:').sub(/\.git$/, '')}"
      end

      remote_url.sub(/\.git$/, "")
    end

    def run_command(*args, chdir:)
      stdout, status = Open3.capture2(*args, chdir: chdir)
      raise "Command '#{args.join(' ')}' failed in '#{chdir}'" unless status.success?

      stdout.strip
    end

    def repository_metadata(repo_root)
      source_url = normalize_remote_url(run_command("git", "remote", "get-url", "origin", chdir: repo_root))
      branch = run_command("git", "rev-parse", "--abbrev-ref", "HEAD", chdir: repo_root)
      { "source_url" => source_url, "branch" => branch }
    rescue StandardError
      { "source_url" => "", "branch" => "master" }
    end

    def clear_generated_outputs
      GENERATED_DIRECTORIES.each do |path|
        FileUtils.rm_rf(path)
      end
      FileUtils.rm_f(LEGACY_GENERATED_MANIFEST_PATH)
    end

    def generated_collection_path(collection_name, *segments)
      File.join(COLLECTIONS_DIRECTORY, "_#{collection_name}", *segments)
    end

    def parse_document_front_matter(raw, context)
      match = raw.match(/\A---\s*\n(.*?)\n---\s*(?:\n|\z)/m)
      raise "#{context} is missing valid front matter" unless match

      ensure_hash(parse_yaml(match[1], context), context)
    end

    def load_document_front_matter(path, context)
      parse_document_front_matter(read_text(path), context)
    end

    def render_document(front_matter, body = "")
      serialized_front_matter = YAML.dump(front_matter).sub(/\A---\s*\n?/, "")
      content = +"---\n#{serialized_front_matter}---\n"
      if body.to_s.empty?
        content << "\n"
      else
        content << "\n#{body}"
        content << "\n" unless body.end_with?("\n")
      end
      content
    end

    def slugify(value)
      value.downcase.gsub(/[^a-z0-9_-]/, "-")
    end

    def human_label(value)
      value
        .tr("_", " ")
        .split(" ")
        .map { |part| part[0] ? part[0].upcase + part[1..] : part }
        .join(" ")
    end

    def append_unique!(target, values)
      values.each do |value|
        target << value unless target.include?(value)
      end
    end
  end

  class ManifestRepository
    include Helpers

    def load
      Dir.glob(File.join(PROJECT_COLLECTIONS_DIRECTORY, "*.md")).sort.map do |path|
        parse(
          load_document_front_matter(path, "Unable to decode project document '#{File.basename(path)}'"),
          File.basename(path)
        )
      end
    end

    private

    def parse(value, label)
      record = Helpers.ensure_hash(value, "Project document #{label}")
      {
        "kind" => Helpers.ensure_string(record["kind"], "Project document #{label}.kind"),
        "slug" => Helpers.ensure_string(record["slug"], "Project document #{label}.slug"),
        "title" => Helpers.ensure_string(record["title"], "Project document #{label}.title"),
        "description" => Helpers.ensure_string(record["description"], "Project document #{label}.description"),
        "route_base" => Helpers.ensure_string(record["route_base"], "Project document #{label}.route_base"),
        "entry_url" => Helpers.ensure_string(record["entry_url"], "Project document #{label}.entry_url"),
        "source_url" => Helpers.ensure_string(record["source_url"], "Project document #{label}.source_url"),
        "source_repo_path" => Helpers.ensure_string(record["source_repo_path"], "Project document #{label}.source_repo_path"),
        "source_optional" => Helpers.ensure_boolean_or_nil(record["source_optional"], "Project document #{label}.source_optional")
      }
    end
  end

  class EurekaBuilder
    CATALOG_VERSION = 2
    METADATA_KEYS = %w[name url difficulty categories].freeze
    IMPLEMENTATION_KEYS = %w[language approach file_path].freeze

    def initialize(manifest)
      @manifest = manifest
      @source_root = File.join(ROOT, manifest.fetch("source_repo_path"))
    end

    def build
      source = decode_source(Helpers.read_text(File.join(@source_root, "data", "problems.yml")))
      @source_url_base = source.fetch("source_url_base")
      project_context = {
        "project_slug" => @manifest.fetch("slug")
      }
      model = build_model(source)

      {
        files: [
          build_problem_filter_document(model.fetch(:problem_filters), project_context)
        ] + build_problem_documents(model.fetch(:problems), project_context) +
          build_implementation_documents(model.fetch(:implementations), project_context) +
          build_language_documents(model.fetch(:languages), project_context),
        assets: []
      }
    end

    private

    def decode_source(raw)
      source = Helpers.ensure_hash(Helpers.parse_yaml(raw, "Unable to decode Eureka problem table"), "Eureka source")
      version = source["version"]
      raise "Eureka source.version must be #{CATALOG_VERSION}" unless version == CATALOG_VERSION

      source_url_base = Helpers.ensure_string(source["source_url_base"], "Eureka source.source_url_base")
      languages = Helpers.ensure_hash(source["languages"], "Eureka source.languages").each_with_object({}) do |(slug, value), result|
        record = Helpers.ensure_hash(value, "Eureka source.languages.#{slug}")
        result[slug] = {
          "label" => Helpers.ensure_string(record["label"], "Eureka source.languages.#{slug}.label"),
          "code_language" => Helpers.ensure_string(record["code_language"], "Eureka source.languages.#{slug}.code_language")
        }
      end

      problems = Helpers.ensure_hash(source["problems"], "Eureka source.problems").each_with_object({}) do |(slug, value), result|
        result[slug] = decode_problem(slug, Helpers.ensure_hash(value, "Problem '#{slug}'"), languages)
      end

      {
        "source_url_base" => source_url_base,
        "languages" => languages,
        "problems" => problems
      }
    end

    def decode_problem(slug, raw_problem, languages)
      unknown_keys = raw_problem.keys - (METADATA_KEYS + ["implementations"])
      unless unknown_keys.empty?
        raise "Problem '#{slug}' references unsupported keys: #{unknown_keys.join(', ')}"
      end

      implementations = Helpers.ensure_array(raw_problem["implementations"], "Problem '#{slug}'.implementations").map.with_index do |entry, index|
        implementation = Helpers.ensure_hash(entry, "Problem '#{slug}'.implementations[#{index}]")
        unknown_implementation_keys = implementation.keys - IMPLEMENTATION_KEYS
        unless unknown_implementation_keys.empty?
          raise "Problem '#{slug}' implementation #{index} references unsupported keys: #{unknown_implementation_keys.join(', ')}"
        end

        language_slug = Helpers.ensure_string(
          implementation["language"],
          "Problem '#{slug}'.implementations[#{index}].language"
        )
        language = languages[language_slug]
        raise "Problem '#{slug}' implementation #{index} references unknown language '#{language_slug}'" unless language

        {
          "language" => language_slug,
          "approach" => Helpers.ensure_string(
            implementation["approach"],
            "Problem '#{slug}'.implementations[#{index}].approach"
          ),
          "file_path" => Helpers.ensure_string(
            implementation["file_path"],
            "Problem '#{slug}'.implementations[#{index}].file_path"
          )
        }
      end

      raise "Problem '#{slug}' has no implementations" if implementations.empty?

      {
        "name" => Helpers.ensure_string(raw_problem["name"], "Problem '#{slug}'.name"),
        "url" => Helpers.ensure_string(raw_problem["url"], "Problem '#{slug}'.url"),
        "difficulty" => Helpers.ensure_string(raw_problem["difficulty"], "Problem '#{slug}'.difficulty"),
        "categories" => Helpers.ensure_array_of_strings(raw_problem["categories"], "Problem '#{slug}'.categories"),
        "implementations" => implementations
      }
    end

    def build_model(source)
      language_entries = source.fetch("languages").to_a
      problem_entries = source.fetch("problems").to_a
      codes = {}

      problem_entries.each do |_slug, problem|
        list_problem_implementations(language_entries, problem).each do |implementation|
          codes[implementation.fetch(:file_path)] = load_code(implementation.fetch(:file_path))
        end
      end

      implementation_records = problem_entries.flat_map do |slug, problem|
        list_problem_implementations(language_entries, problem).map do |implementation|
          build_implementation_record(
            slug,
            problem.fetch("name"),
            problem.fetch("url"),
            implementation.fetch(:language_slug),
            implementation.fetch(:language),
            implementation.fetch(:approach),
            implementation.fetch(:source_url),
            codes.fetch(implementation.fetch(:file_path))
          )
        end
      end

      implementations_by_problem = implementation_records.group_by { |implementation| implementation.fetch("problem_slug") }

      problem_pages = problem_entries.map do |slug, problem|
        build_problem_page(language_entries, slug, problem, implementations_by_problem.fetch(slug, []))
      end

      categories = []
      difficulties = []
      problem_pages.each do |problem_page|
        Helpers.append_unique!(categories, problem_page.fetch("categories"))
        Helpers.append_unique!(difficulties, [problem_page.fetch("difficulty")])
      end

      language_pages = language_entries.map do |slug, language|
        {
          "slug" => slug,
          "label" => language.fetch("label"),
          "title" => "#{language.fetch('label')} Solutions",
          "description" => "All LeetCode solutions in #{language.fetch('label')}."
        }
      end

      {
        problems: problem_pages,
        implementations: implementation_records,
        languages: language_pages,
        problem_filters: {
          "difficulties" => difficulties,
          "categories" => categories,
          "languages" => language_entries.map { |slug, language| { "slug" => slug, "label" => language.fetch("label") } }
        }
      }
    end

    def build_problem_filter_document(problem_filters, project_context)
      {
        path: generated_index_path,
        content: Helpers.render_document(
          {
            "title" => "#{Helpers.human_label(project_context.fetch('project_slug'))} Filters",
            "project_slug" => project_context.fetch("project_slug"),
            "problem_filters" => problem_filters
          }
        )
      }
    end

    def build_problem_documents(problems, project_context)
      problems.map do |problem|
        {
          path: generated_problem_path(problem.fetch("problem_slug")),
          content: Helpers.render_document(
            problem.merge(
              "description" => "#{problem.fetch('title')} solutions"
            ).merge(project_context)
          )
        }
      end
    end

    def build_implementation_documents(implementations, project_context)
      implementations.map do |implementation|
        {
          path: generated_implementation_path(implementation.fetch("problem_slug"), implementation.fetch("implementation_id")),
          content: Helpers.render_document(
            implementation.reject { |key, _value| key == "code" }.merge(project_context),
            render_implementation_body(implementation.fetch("code_language"), implementation.fetch("code"))
          )
        }
      end
    end

    def build_language_documents(languages, project_context)
      languages.map do |language|
        {
          path: generated_language_path(language.fetch("slug")),
          content: Helpers.render_document(
            language.merge(
              "language_filter" => language.fetch("slug"),
              "project_slug" => project_context.fetch("project_slug")
            )
          )
        }
      end
    end

    def build_problem_page(language_entries, slug, problem, implementations)
      implementations_by_language = implementations.group_by { |implementation| implementation.fetch("language") }
      languages = language_entries.filter_map do |language_slug, language|
        next unless implementations_by_language.key?(language_slug)

        {
          "slug" => language_slug,
          "label" => language.fetch("label"),
          "count" => implementations_by_language.fetch(language_slug).size
        }
      end

      {
        "problem_slug" => slug,
        "title" => problem.fetch("name"),
        "problem_source_url" => problem.fetch("url"),
        "difficulty" => problem.fetch("difficulty"),
        "difficulty_slug" => Helpers.slugify(problem.fetch("difficulty")),
        "categories" => problem.fetch("categories"),
        "languages" => languages,
        "implementations" => implementations.map { |implementation| implementation_summary(implementation) },
        "implementation_count" => implementations.size,
        "search_title" => problem.fetch("name").downcase
      }
    end

    def list_problem_implementations(language_entries, problem)
      language_entries.flat_map do |language_slug, language|
        problem.fetch("implementations").filter_map do |implementation|
          next unless implementation.fetch("language") == language_slug

          {
            language_slug: language_slug,
            language: language,
            approach: implementation.fetch("approach"),
            file_path: implementation.fetch("file_path"),
            source_url: source_url_for(implementation.fetch("file_path"))
          }
        end
      end
    end

    def build_implementation_record(problem_slug, problem_title, problem_source_url, language_slug, language, approach, source_url, code)
      implementation_id = Helpers.slugify("#{language_slug}-#{approach}")
      approach_label = Helpers.human_label(approach)
      language_label = language.fetch("label")
      {
        "problem_slug" => problem_slug,
        "problem_title" => problem_title,
        "problem_source_url" => problem_source_url,
        "implementation_id" => implementation_id,
        "language" => language_slug,
        "language_label" => language_label,
        "approach" => approach,
        "approach_label" => approach_label,
        "title" => "#{problem_title} · #{language_label} #{approach_label}",
        "description" => "#{problem_title} solution in #{language_label} using the #{approach_label.downcase} approach.",
        "source_url" => source_url,
        "code" => code,
        "code_language" => language.fetch("code_language"),
        "detail_url" => "#{@manifest.fetch('route_base')}/problems/#{problem_slug}/##{implementation_id}",
        "embed_url" => "#{@manifest.fetch('route_base')}/problems/#{problem_slug}/embed/#{implementation_id}/"
      }
    end

    def implementation_summary(implementation)
      implementation.slice(
        "implementation_id",
        "language",
        "language_label",
        "approach",
        "approach_label",
        "source_url",
        "code_language",
        "detail_url",
        "embed_url"
      )
    end

    def render_implementation_body(code_language, code)
      "~~~#{code_language}\n#{code.rstrip}\n~~~\n"
    end

    def source_url_for(file_path)
      "#{@source_url_base}/#{file_path}"
    end

    def load_code(file_path)
      source_path = File.join(@source_root, file_path)
      raise "Eureka implementation source is missing: '#{source_path}'" unless File.exist?(source_path)

      code = Helpers.read_text(source_path)
      raise "Eureka implementation source is empty: '#{source_path}'" if code.strip.empty?

      code
    end

    def generated_problem_path(problem_slug)
      Helpers.generated_collection_path("eureka_problems", @manifest.fetch("slug"), "problems", "#{problem_slug}.md")
    end

    def generated_index_path
      Helpers.generated_collection_path("eureka_indexes", "#{@manifest.fetch('slug')}.md")
    end

    def generated_implementation_path(problem_slug, implementation_id)
      Helpers.generated_collection_path(
        "eureka_implementations",
        @manifest.fetch("slug"),
        "problems",
        problem_slug,
        "embed",
        "#{implementation_id}.md"
      )
    end

    def generated_language_path(language_slug)
      Helpers.generated_collection_path("eureka_languages", @manifest.fetch("slug"), "#{language_slug}.md")
    end
  end

  class SourceNotesBuilder
    CATALOG_VERSION = 1

    IGNORED_DIRECTORY_NAMES = %w[.git .idea .bsp build dist node_modules out target].freeze

    TEXT_FILE_METADATA = {
      ".conf" => { "format" => "code", "syntax" => "conf", "language" => "config" },
      ".gradle" => { "format" => "code", "syntax" => "groovy", "language" => "groovy" },
      ".java" => { "format" => "code", "syntax" => "java", "language" => "java" },
      ".json" => { "format" => "code", "syntax" => "json", "language" => "json" },
      ".kts" => { "format" => "code", "syntax" => "kotlin", "language" => "kotlin" },
      ".md" => { "format" => "markdown", "syntax" => "", "language" => "markdown" },
      ".properties" => { "format" => "code", "syntax" => "properties", "language" => "properties" },
      ".scala" => { "format" => "code", "syntax" => "scala", "language" => "scala" },
      ".sc" => { "format" => "code", "syntax" => "scala", "language" => "scala" },
      ".sbt" => { "format" => "code", "syntax" => "scala", "language" => "scala" },
      ".sql" => { "format" => "code", "syntax" => "sql", "language" => "sql" },
      ".txt" => { "format" => "markdown", "syntax" => "", "language" => "text" },
      ".xml" => { "format" => "code", "syntax" => "xml", "language" => "xml" },
      ".yaml" => { "format" => "code", "syntax" => "yaml", "language" => "yaml" },
      ".yml" => { "format" => "code", "syntax" => "yaml", "language" => "yaml" }
    }.freeze

    MARKDOWN_IMAGE_PATTERN = /!\[([^\]]*)\]\(([^)]+)\)/

    def initialize(manifest)
      @manifest = manifest
      @repo_root = File.join(ROOT, manifest.fetch("source_repo_path"))
    end

    def build
      catalog = decode_catalog(Helpers.read_text(File.join(@repo_root, "data", "modules.yml")))
      project_context = {
        "project_slug" => @manifest.fetch("slug"),
        "project_title" => @manifest.fetch("title"),
        "project_url" => @manifest.fetch("entry_url"),
        "project_source_url" => @manifest.fetch("source_url")
      }

      built_languages = catalog.fetch("languages").map do |language|
        build_language(language, catalog.fetch("source_url_base"), project_context)
      end

      {
        files: built_languages.flat_map { |built_language| built_language.fetch(:files) },
        assets: built_languages.flat_map { |built_language| built_language.fetch(:assets) }
      }
    end

    private

    def decode_catalog(raw)
      source = Helpers.ensure_hash(Helpers.parse_yaml(raw, "Unable to decode Zibaldone modules catalog"), "Zibaldone catalog")
      version = source["version"]
      raise "Zibaldone catalog.version must be #{CATALOG_VERSION}" unless version == CATALOG_VERSION

      project = Helpers.ensure_hash(source["project"], "Zibaldone catalog.project")
      project_slug = Helpers.ensure_string(project["slug"], "Zibaldone catalog.project.slug")
      raise "Zibaldone catalog.project.slug must match '#{@manifest.fetch('slug')}'" unless project_slug == @manifest.fetch("slug")

      source_url_base = Helpers.ensure_string(source["source_url_base"], "Zibaldone catalog.source_url_base")
      languages = Helpers.ensure_hash(source["languages"], "Zibaldone catalog.languages").map do |language_slug, value|
        decode_language(language_slug, Helpers.ensure_hash(value, "Language '#{language_slug}'"))
      end

      raise "Zibaldone catalog.languages must not be empty" if languages.empty?

      {
        "source_url_base" => source_url_base,
        "languages" => languages.sort_by { |language| language.fetch("title").downcase }
      }
    end

    def decode_language(language_slug, raw_language)
      record = {
        "slug" => language_slug,
        "title" => Helpers.ensure_string(raw_language["title"], "Language '#{language_slug}'.title"),
        "path" => Helpers.ensure_string(raw_language["path"], "Language '#{language_slug}'.path"),
        "modules" => Helpers.ensure_hash(raw_language["modules"], "Language '#{language_slug}'.modules").map do |module_slug, value|
          decode_module(language_slug, module_slug, Helpers.ensure_hash(value, "Module '#{language_slug}/#{module_slug}'"))
        end
      }

      if record.fetch("modules").empty?
        raise "Language '#{language_slug}' must define at least one module"
      end

      record
    end

    def decode_module(language_slug, module_slug, raw_module)
      {
        "slug" => module_slug,
        "title" => Helpers.ensure_string(raw_module["title"], "Module '#{language_slug}/#{module_slug}'.title"),
        "path" => Helpers.ensure_string(raw_module["path"], "Module '#{language_slug}/#{module_slug}'.path"),
        "source_roots" => Helpers.ensure_array_of_strings(raw_module["source_roots"], "Module '#{language_slug}/#{module_slug}'.source_roots")
      }
    end

    def build_language(language, source_url_base, project_context)
      language_context = project_context.merge(
        "language_slug" => language.fetch("slug"),
        "language_title" => language.fetch("title"),
        "language_url" => "#{@manifest.fetch('route_base')}/#{language.fetch('slug')}/"
      )
      built_modules = language.fetch("modules").sort_by { |module_record| module_record.fetch("title").downcase }.map do |module_record|
        build_module(module_record, source_url_base, language_context)
      end
      language_source_url = build_tree_source_url(source_url_base, language.fetch("path"))
      language_record = build_language_record(language_context, language_source_url)

      {
        files: [build_language_page(language_record)] + built_modules.flat_map { |built_module| built_module.fetch(:files) },
        assets: built_modules.flat_map { |built_module| built_module.fetch(:assets) }
      }
    end

    def build_language_page(language_record)
      {
        path: generated_source_language_path(language_record.fetch("language_slug")),
        content: Helpers.render_document(
          language_record.merge(
            "title" => language_record.fetch("language_title"),
            "description" => "Source notes for #{language_record.fetch('language_title')}."
          )
        )
      }
    end

    def build_language_record(language_context, source_url)
      {
        "project_slug" => language_context.fetch("project_slug"),
        "project_title" => language_context.fetch("project_title"),
        "project_url" => language_context.fetch("project_url"),
        "project_source_url" => language_context.fetch("project_source_url"),
        "language_slug" => language_context.fetch("language_slug"),
        "language_title" => language_context.fetch("language_title"),
        "source_url" => source_url
      }
    end

    def build_module(module_candidate, source_url_base, language_context)
      absolute_path = File.join(@repo_root, module_candidate.fetch("path"))
      raise "Module '#{module_candidate.fetch('slug')}' is missing at '#{absolute_path}'" unless File.directory?(absolute_path)

      readme = rewrite_markdown_assets(
        Helpers.maybe_read_text(File.join(absolute_path, "README.md")),
        absolute_path,
        "#{@manifest.fetch('slug')}/#{language_context.fetch('language_slug')}/#{module_candidate.fetch('slug')}"
      )
      documents = build_module_documents(module_candidate, absolute_path, source_url_base, language_context)
      module_source_url = build_tree_source_url(source_url_base, module_candidate.fetch("path"))
      module_record = build_module_record(module_candidate, module_source_url, documents, language_context)
      module_data = module_record.merge("readme_markdown" => readme.fetch(:markdown))

      {
        assets: readme.fetch(:assets),
        files: [
          build_module_page(module_data)
        ] + documents.map { |document| build_document_page(document.fetch(:generated)) },
        module: module_data
      }
    end

    def build_module_page(module_data)
      front_matter = module_data.reject { |key, _value| key == "readme_markdown" }
      {
        path: generated_source_module_path(module_data.fetch("language_slug"), module_data.fetch("module_slug")),
        content: Helpers.render_document(
          front_matter.merge(
            "description" => "#{module_data.fetch('title')} notes",
            "module_slug" => module_data.fetch("module_slug")
          ),
          module_data.fetch("readme_markdown")
        )
      }
    end

    def build_document_page(document)
      front_matter = document.reject { |key, _value| key == "body" || key == "id" || key == "route_url" }
        .merge("document_id" => document.fetch("id"))
      {
        path: generated_source_document_path(document.fetch("module_slug"), document.fetch("route_url")),
        content: Helpers.render_document(
          front_matter.merge(
            "description" => "#{document.fetch('title')} notes"
          ),
          document.fetch("body")
        )
      }
    end

    def build_module_documents(module_candidate, absolute_path, source_url_base, language_context)
      module_candidate.fetch("source_roots").flat_map do |root_label|
        absolute_root = File.join(absolute_path, root_label)
        raise "Module '#{module_candidate.fetch('slug')}' root '#{root_label}' is missing at '#{absolute_root}'" unless File.directory?(absolute_root)

        walk_text_files(absolute_root).map do |file_path|
          content = Helpers.read_text(file_path)
          build_source_document(
            module_candidate: module_candidate,
            root_label: root_label,
            absolute_root: absolute_root,
            file_path: file_path,
            content: content,
            source_url_base: source_url_base,
            language_context: language_context
          )
        end
      end
    end

    def walk_text_files(directory)
      Dir.children(directory).sort.flat_map do |name|
        full_path = File.join(directory, name)
        if File.directory?(full_path)
          next [] if name.start_with?(".") || IGNORED_DIRECTORY_NAMES.include?(name)

          walk_text_files(full_path)
        else
          TEXT_FILE_METADATA.key?(File.extname(name).downcase) ? [full_path] : []
        end
      end
    end

    def build_source_document(module_candidate:, root_label:, absolute_root:, file_path:, content:, source_url_base:, language_context:)
      relative_to_root = relative_path(absolute_root, file_path)
      route_path = build_route_path(relative_to_root)
      tree_path = "#{root_label}/#{relative_to_root}"
      source_path = relative_path(@repo_root, file_path)
      document_metadata = TEXT_FILE_METADATA[File.extname(file_path).downcase]
      document = {
        "id" => "#{language_context.fetch('language_slug')}:#{module_candidate.fetch('slug')}:#{tree_path}",
        "project_slug" => language_context.fetch("project_slug"),
        "project_title" => language_context.fetch("project_title"),
        "project_url" => language_context.fetch("project_url"),
        "project_source_url" => language_context.fetch("project_source_url"),
        "language_slug" => language_context.fetch("language_slug"),
        "language_title" => language_context.fetch("language_title"),
        "language_url" => language_context.fetch("language_url"),
        "module_slug" => module_candidate.fetch("slug"),
        "module_title" => module_candidate.fetch("title"),
        "title" => File.basename(file_path),
        "route_url" => "#{language_context.fetch('language_url')}#{module_candidate.fetch('slug')}/#{route_path}/",
        "tree_path" => tree_path,
        "source_path" => source_path,
        "source_url" => source_url_base.empty? ? "" : "#{source_url_base}/#{source_path}",
        "language" => document_metadata ? document_metadata.fetch("language") : language_context.fetch("language_slug"),
        "format" => document_metadata ? document_metadata.fetch("format") : "code",
        "breadcrumbs" => build_document_breadcrumbs(language_context, module_candidate.fetch("slug"), module_candidate.fetch("title"), relative_to_root)
      }
      body = build_document_body(content, document_metadata)

      {
        metadata: document,
        generated: document.merge("body" => body)
      }
    end

    def build_document_body(content, metadata)
      return content if metadata.nil? || metadata.fetch("format") == "markdown"

      "~~~#{metadata.fetch('syntax')}\n#{content.rstrip}\n~~~\n"
    end

    def build_document_breadcrumbs(language_context, module_slug, module_title, relative_path)
      breadcrumbs = [
        { "label" => language_context.fetch("project_title"), "url" => language_context.fetch("project_url") },
        { "label" => language_context.fetch("language_title"), "url" => language_context.fetch("language_url") },
        { "label" => module_title, "url" => "#{language_context.fetch('language_url')}#{module_slug}/" }
      ]

      relative_path.split("/")[0...-1].each do |segment|
        breadcrumbs << { "label" => segment, "url" => "" }
      end

      breadcrumbs
    end

    def build_route_path(relative_path)
      segments = relative_path.split("/")
      segments.each_with_index.map do |segment, index|
        index == segments.length - 1 ? slugify_module_name(File.basename(segment, File.extname(segment))) : slugify_module_name(segment)
      end.reject(&:empty?).join("/")
    end

    def build_module_record(module_candidate, module_source_url, documents, language_context)
      document_entries = documents.map { |document| document.fetch(:metadata) }
      {
        "project_slug" => language_context.fetch("project_slug"),
        "project_title" => language_context.fetch("project_title"),
        "project_url" => language_context.fetch("project_url"),
        "project_source_url" => language_context.fetch("project_source_url"),
        "language_slug" => language_context.fetch("language_slug"),
        "language_title" => language_context.fetch("language_title"),
        "language_url" => language_context.fetch("language_url"),
        "slug" => module_candidate.fetch("slug"),
        "module_slug" => module_candidate.fetch("slug"),
        "title" => module_candidate.fetch("title"),
        "source_url" => module_source_url,
        "route_url" => "#{language_context.fetch('language_url')}#{module_candidate.fetch('slug')}/",
        "roots" => build_module_roots(module_candidate, document_entries)
      }
    end

    def build_module_roots(module_candidate, documents)
      module_candidate.fetch("source_roots").map do |root_label|
        prefix = "#{root_label}/"
        entries = documents
          .select { |document| document.fetch("tree_path").start_with?(prefix) }
          .map do |document|
            {
              relative_path: document.fetch("tree_path").delete_prefix(prefix),
              url: document.fetch("route_url")
            }
          end

        {
          "label" => root_label,
          "tree_path" => prefix,
          "nodes" => build_file_tree(root_label, entries)
        }
      end
    end

    def build_file_tree(root_label, entries)
      root = []

      entries.each do |entry|
        segments = entry.fetch(:relative_path).split("/").reject(&:empty?)
        cursor = root
        segments.each_with_index do |segment, index|
          tree_path = "#{root_label}/#{segments[0..index].join('/')}"
          existing = cursor.find { |node| node.fetch("title") == segment && node.fetch("tree_path") == tree_path }
          if existing
            cursor = existing.fetch("children")
            next
          end

          is_leaf = index == segments.length - 1
          node = {
            "kind" => is_leaf ? "file" : "directory",
            "title" => segment,
            "tree_path" => tree_path,
            "url" => is_leaf ? entry.fetch(:url) : "",
            "children" => []
          }
          cursor << node
          cursor = node.fetch("children")
        end
      end

      sort_tree_nodes(root)
      root
    end

    def sort_tree_nodes(nodes)
      nodes.sort_by! { |node| [node.fetch("kind") == "directory" ? 0 : 1, node.fetch("title").downcase] }
      nodes.each { |node| sort_tree_nodes(node.fetch("children")) }
    end

    def rewrite_markdown_assets(markdown, base_directory, asset_scope)
      seen = {}
      assets = []
      first_image_url = ""

      markdown.to_enum(:scan, MARKDOWN_IMAGE_PATTERN).map { Regexp.last_match }.each do |match|
        raw_reference = match[2].to_s
        clean_reference = sanitize_asset_path(raw_reference)
        next if clean_reference.empty? || clean_reference.start_with?("http://", "https://", "/")
        next if seen.key?(clean_reference)

        source_path = File.expand_path(clean_reference, base_directory)
        next unless File.exist?(source_path)

        target_path = File.join(SITE_SOURCE, "assets", "generated", asset_scope, sanitize_asset_target_path(clean_reference))
        public_url = "/#{Pathname.new(target_path).relative_path_from(Pathname.new(SITE_SOURCE)).to_s.tr(File::SEPARATOR, '/')}"
        seen[clean_reference] = public_url
        assets << { source_path: source_path, target_path: target_path }
        first_image_url = public_url if first_image_url.empty?
      end

      rewritten = markdown.dup
      seen.each do |reference, public_url|
        rewritten.gsub!("](#{reference})", "](#{public_url})")
        rewritten.gsub!("](<#{reference}>)", "](#{public_url})")
      end

      {
        markdown: rewritten.strip,
        assets: assets,
        first_image_url: first_image_url
      }
    end

    def sanitize_asset_path(raw_path)
      raw_path.gsub(/\A<|>\z/, "").split(/\s+/).first.to_s
    end

    def sanitize_asset_target_path(asset_path)
      normalized = asset_path.split("/").reject { |segment| segment.empty? || segment == "." || segment == ".." }.join("/")
      normalized.empty? ? File.basename(asset_path) : normalized
    end

    def relative_path(from_path, to_path)
      Pathname.new(to_path).relative_path_from(Pathname.new(from_path)).to_s.tr(File::SEPARATOR, "/")
    end

    def slugify_module_name(value)
      value
        .gsub(/([a-z0-9])([A-Z])/, '\1-\2')
        .gsub(/[_\s]+/, "-")
        .gsub(/[^a-zA-Z0-9-]/, "-")
        .downcase
        .gsub(/-+/, "-")
        .gsub(/\A-|-?\z/, "")
    end

    def titleize_module_name(value)
      value
        .gsub(/([a-z0-9])([A-Z])/, '\1 \2')
        .tr("_-", " ")
        .split(/\s+/)
        .reject(&:empty?)
        .map { |part| part[0] ? part[0].upcase + part[1..] : part }
        .join(" ")
    end

    def generated_source_language_path(language_slug)
      Helpers.generated_collection_path("source_languages", @manifest.fetch("slug"), "#{language_slug}.md")
    end

    def generated_source_module_path(language_slug, module_slug)
      Helpers.generated_collection_path("source_modules", @manifest.fetch("slug"), language_slug, "#{module_slug}.md")
    end

    def generated_source_document_path(_module_slug, url)
      route_path = url.sub(%r{\A/}, "").sub(%r{/$}, "")
      Helpers.generated_collection_path("source_documents", "#{route_path}.md")
    end

    def build_tree_source_url(source_url_base, relative_path)
      tree_url_base = source_url_base.sub(%r{/blob/([^/]+)\z}, '/tree/\1')
      return "" if tree_url_base == source_url_base && @manifest.fetch("source_url").empty?

      base = tree_url_base == source_url_base ? @manifest.fetch("source_url") : tree_url_base
      relative_path.empty? ? base : "#{base}/#{relative_path}"
    end

  end

  class Runner
    def run
      Helpers.clear_generated_outputs
      manifests = ManifestRepository.new.load
      builds = manifests.filter_map { |manifest| build_project(manifest) }
      write_outputs(builds)
    end

    private

    def build_project(manifest)
      source_path = File.join(ROOT, manifest.fetch("source_repo_path"))
      return nil if !File.exist?(source_path) && manifest["source_optional"]
      raise "Project '#{manifest.fetch('slug')}' source is missing at '#{source_path}'" unless File.exist?(source_path)

      case manifest.fetch("kind")
      when "eureka"
        EurekaBuilder.new(manifest).build
      when "source-notes"
        SourceNotesBuilder.new(manifest).build
      else
        raise "Unsupported project kind '#{manifest.fetch('kind')}'"
      end
    end

    def write_outputs(builds)
      files = builds.flat_map { |build| build.fetch(:files) }
      assets = builds.flat_map { |build| build.fetch(:assets) }
      files.each { |file| Helpers.write_text(file.fetch(:path), file.fetch(:content)) }
      assets.each { |asset| Helpers.copy_file(asset.fetch(:source_path), asset.fetch(:target_path)) }
    end
  end
end

RefreshData::Runner.new.run
