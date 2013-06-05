REPORTER=dot

serve: node_modules
	@node_modules/serve/bin/serve

test:
	@node_modules/.bin/mocha test/*.test.js \
		--reporter $(REPORTER) \
		--bail

node_modules: package.json
	@packin install -m package.json -edr

clean:
	rm -r node_modules

.PHONY: clean serve test