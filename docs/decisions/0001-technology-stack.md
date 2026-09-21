# ADR 0001: Select the Task Manager technology stack

- Status: Proposed
- Date: YYYY-MM-DD

## Context

The application requires browser-based task management, user authentication, persistent storage, and online deployment within the assessment schedule.

## Decision

Use HTML, CSS, and browser JavaScript for the interface; Node.js and Express for the server; MongoDB for persistence; GitHub for version control and CI; and Render for deployment.

## Consequences

The stack uses JavaScript across the client and server and supports rapid development. It also creates responsibilities for dependency updates, secure session handling, environment-secret management, database availability, and hosting limits. Final procurement decisions must be justified separately in the RFP.

