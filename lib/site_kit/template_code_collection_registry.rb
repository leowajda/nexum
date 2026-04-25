# frozen_string_literal: true

module SiteKit
  class TemplateCodeCollectionRegistry
    def initialize(templates:, entries_by_template:, code_collection_config:)
      @templates = templates
      @entries_by_template = entries_by_template
      @code_collection_config = code_collection_config
    end

    def record
      @record ||= begin
        known_template_ids = templates.map(&:template_id)
        stray_entry_ids = entries_by_template.keys.map(&:to_s) - known_template_ids
        unless stray_entry_ids.empty?
          raise "Template entries reference unknown templates: #{stray_entry_ids.sort.join(', ')}"
        end

        templates.each_with_object({}) do |template, result|
          entries = Helpers.ensure_array(
            entries_by_template.fetch(template.template_id) do
              raise "Template '#{template.template_id}' is missing code entries"
            end,
            "Template entries for #{template.template_id}"
          ).map.with_index { |entry, index| normalize_entry(entry, "Template entries for #{template.template_id}[#{index}]") }
          validate_unique_entry_ids!(template.template_id, entries)

          result[template.template_id] = CodeCollectionModel.build(
            entries: entries,
            default_entry_id: entries.first && entries.first["entry_id"],
            toolbar_aria: code_collection_config.default_toolbar_label,
            variant_group_label: code_collection_config.default_variant_label,
            variant_icon_map: code_collection_config.variant_icons
          )
        end
      end
    end

    private

    attr_reader :templates, :entries_by_template, :code_collection_config

    def normalize_entry(entry, context)
      record = Helpers.ensure_hash(entry, context)
      {
        "entry_id" => Helpers.ensure_string(record.fetch("entry_id"), "#{context}.entry_id"),
        "language" => Helpers.ensure_string(record.fetch("language"), "#{context}.language"),
        "language_label" => Helpers.ensure_string(record.fetch("language_label"), "#{context}.language_label"),
        "code_language" => Helpers.ensure_string(record.fetch("code_language"), "#{context}.code_language"),
        "code" => Helpers.ensure_string(record.fetch("code"), "#{context}.code"),
        "variant" => "default",
        "variant_label" => "Default"
      }
    end

    def validate_unique_entry_ids!(template_id, entries)
      duplicate_entry_ids = entries
        .map { |entry| entry.fetch("entry_id") }
        .group_by(&:itself)
        .select { |_, values| values.size > 1 }
        .keys
      return if duplicate_entry_ids.empty?

      raise "Template '#{template_id}' code entry ids must be unique: #{duplicate_entry_ids.join(', ')}"
    end
  end
end
