REPORTER= spec

all: test/built.js

test:
	@node_modules/.bin/mocha test/*.test.js \
		--bail \
		-R $(REPORTER)

clean:
	@rm -rf test/built.js

test/built.js: index.js series/* test/*
	@node_modules/.bin/sourcegraph.js test/browser.js \
		--plugins mocha,nodeish \
		| node_modules/.bin/bigfile.js \
			--export null \
			--plugins nodeish,javascript > $@

.PHONY: all test clean
