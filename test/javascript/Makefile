MOCHA_OPTS= --check-leaks -t 4000 -b
REPORTER = spec

test:
	@NODE_ENV=test ./node_modules/.bin/mocha \
		--reporter $(REPORTER) \
		$(MOCHA_OPTS) \
		./ghostdriver.js

docs: test-docs

test-docs:
	make test REPORTER=doc \
		| cat docs/head.html - docs/tail.html \
		> docs/test.html

app:
	node ./app.js

stress:
	node ./stress.js


ghostdriver:
	phantomjs ../../src/main.js

.PHONY: test docs test-docs app ghostdriver stress