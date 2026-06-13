.PHONY: help install install-dev lint lint-fix format format-check typecheck check fix test run

VENV_PY := venv/bin/python
VENV_PIP := venv/bin/pip

help:
	@echo "Backend make targets:"
	@echo "  make install        install runtime deps"
	@echo "  make install-dev    install dev deps (ruff, pytest)"
	@echo "  make lint           lint with ruff (no fixes)"
	@echo "  make lint-fix       auto-fix lint issues"
	@echo "  make format         auto-format with ruff"
	@echo "  make format-check   check formatting without changing files"
	@echo "  make check          lint + format-check (used by pre-commit)"
	@echo "  make fix            lint-fix + format"
	@echo "  make test           run pytest"
	@echo "  make run            uvicorn dev server"

install:
	$(VENV_PIP) install -r requirements.txt

install-dev:
	$(VENV_PIP) install -r requirements-dev.txt

lint:
	$(VENV_PY) -m ruff check app tests

lint-fix:
	$(VENV_PY) -m ruff check --fix app tests

format:
	$(VENV_PY) -m ruff format app tests

format-check:
	$(VENV_PY) -m ruff format --check app tests

check: lint format-check
	@echo "✓ backend checks passed"

fix: lint-fix format
	@echo "✓ backend auto-fixed"

test:
	$(VENV_PY) -m pytest tests

run:
	$(VENV_PY) -m uvicorn app.main:app --reload
