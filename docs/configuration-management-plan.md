# Configuration Management Plan

## 1. Purpose and scope

This plan defines how source code, documentation, configuration, tests, and deployment artifacts will be identified, changed, reviewed, released, and audited throughout the Task Manager lifecycle.

## 2. Configuration items

| Configuration item | Location | Control method | Owner |
| --- | --- | --- | --- |
| Application source | `src/` and `public/` | Git, pull request, CI | Student developer |
| Automated tests | `tests/` | Git, pull request, CI | Student developer |
| Dependencies | `package.json`, `package-lock.json` | Locked versions, dependency review | Student developer |
| Local configuration template | `.env.example` | Git review; no secrets | Student developer |
| Deployment configuration | `render.yaml` | Git review and Render environment settings | Student developer |
| CI workflow | `.github/workflows/ci.yml` | Git review and GitHub Actions | Student developer |
| Project documentation | `README.md`, `docs/` | Git review | Student developer |
| Release record | `CHANGELOG.md`, Git tags, GitHub Releases | Semantic versioning | Student developer |

## 3. Branching and change control

`main` represents tested, deployable releases. `develop` integrates completed work for the next release. Each change begins with a GitHub Issue and a short-lived `feature/`, `fix/`, or `docs/` branch. A pull request documents scope, linked requirements, risk, and test evidence before merging. Urgent production corrections use a `hotfix/` branch from `main` and are merged back into both `main` and `develop`.

## 4. Version identification

Releases use `MAJOR.MINOR.PATCH` semantic versions. Git tags are signed or annotated, for example `v1.0.0`. Each release has matching changelog notes and a GitHub Release. The deployment records the exact commit SHA so the deployed version is traceable.

## 5. Configuration and secret management

Environment-specific values are read from environment variables. `.env.example` documents required keys without real secrets. Local `.env` files are ignored by Git. Production values are stored in the deployment platform's secret settings. Credentials must be rotated immediately if exposed.

## 6. Build and dependency management

The lockfile is committed to make installations reproducible. CI uses `npm ci`, runs linting and tests, and blocks merging when checks fail. Dependency update pull requests are reviewed and tested before merging.

## 7. Release and deployment control

Only a tested commit from `main` is released. A release candidate is checked in the staging environment before production deployment. Release evidence includes CI results, the pull request, tag, release notes, deployment status, and a functional smoke test.

## 8. Backup, recovery, and rollback

Source and release history are retained in GitHub. MongoDB backup controls will be selected for the deployed database. If a release fails, production is rolled back to the last verified release and the incident is recorded in an Issue. Database changes must remain backward compatible or include a tested restoration procedure.

## 9. Audit evidence

Evidence retained for assessment includes the repository structure, issue list, branch list, pull requests, commit graph, CI runs, tags/releases, changelog, Render deployment, environment-key configuration with secret values hidden, and a rollback or redeployment record.

