generate:
	pnpm generate

build:
	pnpm run build:site

serve:
	pnpm run serve

clean:
	rm -rf site _site node_modules vendor .bundle
