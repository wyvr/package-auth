SHELL := /bin/bash
# @see https://victoria.dev/blog/how-to-create-a-self-documenting-makefile/
.POSIX:

# if a target is existing as folder, add to phony to avoid make from thinking it is "up to date"
# @see https://stackoverflow.com/questions/3931741/why-does-make-think-the-target-is-up-to-date
.PHONY: test coverage
# @see https://spin.atomicobject.com/2021/03/22/makefiles-vs-package-json-scripts/
# base commands

format: ## Format the codebase
	@npx @biomejs/biome format --write .
