generate:
	pnpm generate

build:
	pnpm run build:site

serve:
	pnpm run serve

clean:
	rm -rf _site node_modules vendor .bundle site
	rm -rf site-src/.generated-files.json
	rm -rf site-src/_data/generated site-src/_problem_embeds site-src/_problems
	rm -rf site-src/_source_documents site-src/_source_modules
	rm -rf site-src/assets/generated site-src/assets/js site-src/assets/vendor
	rm -rf site-src/eureka/cpp site-src/eureka/java site-src/eureka/python site-src/eureka/scala
