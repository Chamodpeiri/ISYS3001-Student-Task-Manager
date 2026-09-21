# Deployment and Rollback Runbook

## Pre-deployment checks

- Confirm the pull request is approved and CI is green.
- Confirm required environment keys exist in Render; never expose their values in screenshots.
- Confirm the MongoDB connection and backup status.
- Confirm `CHANGELOG.md` and the planned version are correct.
- Record the release commit SHA.

## Deployment

1. Merge the approved release pull request into `main`.
2. Create an annotated semantic-version tag.
3. Push the tag and create matching GitHub release notes.
4. Allow Render to deploy the exact `main` commit.
5. Verify `/health`, login, task creation, editing, completion, filtering, deletion, and logout.
6. Record the deployment result and evidence in the release Issue.

## Rollback

1. Stop further changes and open an incident Issue.
2. Identify the last verified Git tag and Render deployment.
3. Roll back Render to that deployment.
4. Run the smoke tests again.
5. Record the cause, impact, recovery time, and corrective action.
6. Develop the correction on a `hotfix/` branch and merge it through a pull request.

