REPORTER = dot

test:
	@node_modules/.bin/mocha \
			--reporter $(REPORTER) \
			--require should \
			--growl

watch:
	@node_modules/.bin/mocha \
			--reporter $(REPORTER) \
			--require should \
			--growl \
			--watch

serve:
	@./node_modules/.bin/node-dev app

debug:
	@node --debug app

.PHONY: test watch