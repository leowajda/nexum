validate-catalogs:
	ruby script/validate_catalogs.rb

check:
	ruby -c script/validate_catalogs.rb

build:
	bundle exec jekyll build --source site-src --destination _site

check-links:
	ruby script/check_internal_links.rb

serve:
	bundle exec jekyll serve --source site-src --destination _site --host 127.0.0.1 --port 4173 --livereload --livereload-port 35730

test-ruby:
	bundle exec ruby -Itest test/run.rb

test: check validate-catalogs test-ruby build check-links

test-full: test
	playwright test tests/mobile-smoke.spec.js --config=playwright.mobile.config.js

clean:
	rm -rf _site node_modules vendor .bundle
