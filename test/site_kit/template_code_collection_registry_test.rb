# frozen_string_literal: true

require_relative "../test_helper"

class SiteKitTemplateCodeCollectionRegistryTest < SiteKitTestCase
  def test_builds_precomputed_template_code_collections
    collection = build_context.template_library_context.code_collections.fetch("binary-search")

    assert_equal "binary-search-java", collection.fetch("default_entry_id")
    assert collection.fetch("items").any?
    assert_equal 1, collection.fetch("toolbar_groups").size
    assert_equal "language", collection.fetch("toolbar_groups").first.fetch("kind")
  end

  def test_rejects_duplicate_template_code_entry_ids
    template = build_context.template_library_context.templates.find { |entry| entry.template_id == "binary-search" }
    entry = {
      "entry_id" => "binary-search-java",
      "language" => "java",
      "language_label" => "Java",
      "code_language" => "java",
      "code" => "class Solution {}"
    }

    error = assert_raises(RuntimeError) do
      SiteKit::TemplateCodeCollectionRegistry.new(
        templates: [template],
        entries_by_template: { template.template_id => [entry, entry] },
        code_collection_config: build_context.app_config.code_collection
      ).record
    end

    assert_match(/code entry ids must be unique: binary-search-java/, error.message)
  end
end
