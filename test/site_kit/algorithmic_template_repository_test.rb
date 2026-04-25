# frozen_string_literal: true

require_relative "../test_helper"

class SiteKitAlgorithmicTemplateRepositoryTest < SiteKitTestCase
  def test_loads_templates_from_the_collection
    template = build_context.template_library_context.templates.find { |entry| entry.template_id == "binary-search" }

    assert template
    assert_equal "Binary Search", template.title
    assert_equal "Search And Window", template.group_title
    assert_equal ["Binary Search"], template.eureka_categories
  end

  def test_rejects_duplicate_template_group_ids
    groups = [
      { "id" => "search", "title" => "Search", "order" => 1 },
      { "id" => "search", "title" => "Search Again", "order" => 2 }
    ]

    error = assert_raises(RuntimeError) do
      SiteKit::AlgorithmicTemplateRepository.new(documents: [], groups:).load
    end

    assert_match(/Template group ids must be unique: search/, error.message)
  end
end
