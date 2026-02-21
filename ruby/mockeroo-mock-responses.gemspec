# frozen_string_literal: true

require_relative 'lib/mockeroo_mock_responses/version'

Gem::Specification.new do |spec|
  spec.name          = 'mockeroo-mock-responses'
  spec.version       = MockerooMockResponses::VERSION
  spec.authors       = ['mockeroo']
  spec.summary       = 'Sarcastic HTTP status code responses for testing and development.'
  spec.description   = 'Like Mockoon, but worse. Returns sarcastic mock HTTP responses.'
  spec.homepage      = 'https://github.com/mockeroo/mock-responses'
  spec.license       = 'MIT'

  spec.required_ruby_version = '>= 2.7'

  spec.metadata['source_code_uri'] = 'https://github.com/mockeroo/mock-responses'

  # When installed from RubyGems the gem includes a bundled responses/ directory.
  # In the monorepo the library falls back to ../responses/ automatically.
  spec.files         = Dir['lib/**/*', 'responses/**/*', 'README.md', 'LICENSE']
  spec.require_paths = ['lib']
end
