# Git Workflow and Assessment Evidence

## Repository identification

- GitHub account: `Chamodpeiri`
- Repository: `Chamodpeiri/ISYS3001-Student-Task-Manager`
- Production branch: `main`
- Integration branch: `develop`
- Current development branch: `feature/1-project-scaffold`

Do not add a student ID, password, database credential, access token, or private personal information to the public repository.

## Genuine development sequence

Complete each item as real work. Open an Issue first, create the branch from `develop`, make focused commits, push the branch, open a pull request, confirm CI, and merge it. Do not create all commits at the end merely to imitate activity.

| Order | Issue and branch example | Expected evidence |
| --- | --- | --- |
| 1 | Repository foundation on `main` | Initial commit, repository structure, README |
| 2 | Create `develop` branch | Branch list and branch protection/ruleset |
| 3 | Issue #1 - `feature/1-project-scaffold` | Issue, commits, pull request, CI run |
| 4 | Issue #2 - `feature/2-authentication` | Acceptance criteria, tests, pull request |
| 5 | Issue #3 - `feature/3-task-crud` | Several focused commits, tests, pull request |
| 6 | Issue #4 - `feature/4-task-status-filter` | Linked issue, UI evidence, pull request |
| 7 | Issue #5 - `chore/5-quality-maintenance` | CI, security and maintenance evidence |
| 8 | Issue #6 - `release/1.0.0` | Changelog, release pull request, deployment |
| 9 | Tag and release `v1.0.0` | Annotated tag, GitHub Release, deployed SHA |
| 10 | Controlled correction, if genuinely needed | `hotfix/` issue, PR, patch release, rollback evidence |

## Advanced Git/GitHub features to demonstrate

- Issue templates and labelled Issues with acceptance criteria
- Short-lived feature, fix, docs, release, and genuine hotfix branches
- Pull requests that link Issues and contain verification evidence
- Protected `main` and `develop` branches or repository rulesets
- Required CI status checks before merging
- Conventional Commits and atomic changes
- `git log --graph --decorate --all` showing branch and merge history
- Annotated semantic-version tags
- GitHub Releases and maintained changelog
- Revert or rollback process demonstrated only when justified
- Dependabot dependency update pull requests
- Commit or tag signing if the student's Git environment supports it

## Recommended screenshots

Capture readable screenshots and explain the significance of each one in your own words.

1. Repository root showing organized artifacts.
2. GitHub Issues showing requirements and status labels.
3. Branch/ruleset settings with required pull request and CI controls.
4. A feature branch commit history with meaningful messages.
5. A pull request linked to an Issue, with checks passing.
6. GitHub Actions run showing lint and tests.
7. Network graph or local decorated Git graph.
8. Tags and GitHub Releases page.
9. `CHANGELOG.md` for the matching release.
10. `render.yaml` plus Render deployment for the same commit SHA.
11. Render environment-key list with every secret value hidden.
12. Successful health check and application smoke test.

## Privacy warning

Do not show student ID, passwords, database connection strings, session secrets, access tokens, private email addresses, or other personal information in GitHub or screenshots.
