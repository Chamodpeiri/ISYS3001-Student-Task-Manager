# Contributing Guide

## Before starting work

1. Create or select a GitHub Issue with clear acceptance criteria.
2. Update local `develop`.
3. Create a correctly named branch from `develop`.

Example:

```bash
git switch develop
git pull --ff-only origin develop
git switch -c feature/12-task-filter
```

## Commit standard

Use Conventional Commits and make each commit one logical change:

```text
feat(tasks): add completed-task filter
fix(auth): prevent login with invalid password
test(tasks): cover task deletion authorization
docs(deploy): document Render rollback procedure
chore(deps): update Express patch version
```

Do not use messages such as `update`, `changes`, `final`, or `work done`.

## Pull-request standard

- Link the issue with `Closes #<number>`.
- Explain what changed and why.
- Include testing evidence and screenshots when the UI changes.
- Confirm no secrets or generated files were committed.
- Wait for CI checks to pass before merging.
- Prefer squash merge for a small feature; use merge commits for release branches when the history is useful.

## Definition of done

- Acceptance criteria are satisfied.
- Tests and linting pass.
- Documentation and `.env.example` are updated where required.
- Security and configuration impact has been checked.
- Pull request is merged and its branch is deleted.
- User-facing changes are recorded under `Unreleased` in `CHANGELOG.md`.

