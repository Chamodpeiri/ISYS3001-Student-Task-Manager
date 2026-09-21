# Task Manager

A small web application for creating, editing, deleting, completing, and filtering personal tasks.

## Planned technology

- Front end: HTML, CSS, and JavaScript
- Back end: Node.js and Express
- Database: MongoDB
- Deployment: Render
- Version control: Git and GitHub

## Planned features

- User registration, login, and logout
- Create, edit, and delete tasks
- Mark tasks as completed or pending
- Filter tasks by all, pending, or completed
- Store users and tasks in MongoDB
- Deploy the application online

## Local setup

1. Install Node.js 20 or later and MongoDB.
2. Copy `.env.example` to `.env`.
3. Replace the example environment values with local values.
4. Run `npm install` after the application package is added.
5. Run `npm run dev` to start the development server.

Never commit `.env`, passwords, database credentials, or session secrets.

## Repository workflow

Development uses short-lived branches created from `develop`:

- `feature/<issue-number>-<description>` for new functionality
- `fix/<issue-number>-<description>` for bug fixes
- `docs/<issue-number>-<description>` for documentation
- `release/<version>` for release preparation
- `hotfix/<issue-number>-<description>` for urgent production fixes

Changes are merged through reviewed pull requests after automated checks pass. Production releases are merged to `main`, tagged using semantic versioning, and recorded in `CHANGELOG.md`.

See [CONTRIBUTING.md](CONTRIBUTING.md) and [docs/configuration-management-plan.md](docs/configuration-management-plan.md) for the full process.

## Documentation

- Configuration management plan: `docs/configuration-management-plan.md`
- Deployment and rollback runbook: `docs/deployment-runbook.md`
- Change history: `CHANGELOG.md`
- Architecture decisions: `docs/decisions/`

## Licence

Created for an individual university assessment. All rights reserved.
