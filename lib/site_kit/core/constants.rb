# frozen_string_literal: true

module SiteKit
  EUREKA_NAMESPACE = 'eureka'
  EUREKA_PROJECT_KIND = 'eureka'
  SOURCE_NOTES_PROJECT_KIND = 'source-notes'

  EUREKA_LANGUAGE_PAGE_TYPE = 'eureka_language_page'
  EUREKA_PROBLEM_PAGE_TYPE = 'eureka_problem_page'
  EUREKA_IMPLEMENTATION_PAGE_TYPE = 'eureka_implementation_page'
  SOURCE_LANGUAGE_PAGE_TYPE = 'source_language_page'
  SOURCE_MODULE_PAGE_TYPE = 'source_module_page'

  DISALLOWED_PROBLEM_TEMPLATE_KEYS = %w[
    template_guide_primary
    template_guide_url
    template_pattern_ids
    template_patterns
  ].freeze
end
