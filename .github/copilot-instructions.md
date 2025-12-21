# Copilot Instructions for sigestei-backend

## Project Overview
This is a Node.js backend project using Express (v5) and managed with pnpm. The main entry point is `src/server.js`, with application logic expected in `src/app.js`. The codebase is structured for modularity, with folders for controllers, models, repositories, routes, services, config, middlewares, and utils under `src/api/`, though these are currently empty.

## Architecture & Patterns
- **Express App**: The server is started from `src/server.js`, which should import and use the Express app from `src/app.js`.
- **Modular Structure**: All business logic, data access, and routing should be organized under `src/api/` using the following conventions:
  - `controllers/`: Handle HTTP requests and responses.
  - `models/`: Define data schemas or ORM models.
  - `repositories/`: Encapsulate data access logic.
  - `routes/`: Define Express routes and connect them to controllers.
  - `services/`: Implement business logic, called by controllers.
  - `config/`: Store configuration files (e.g., environment, database).
  - `middlewares/`: Custom Express middlewares.
  - `utils/`: Utility/helper functions.
- **Environment Variables**: Use the `dotenv` package for configuration. Load `.env` in `server.js` or `app.js`.

## Developer Workflows
- **Start Server**: `pnpm start` runs `node src/server.js`.
- **Development Mode**: `pnpm dev` uses `nodemon` for hot-reloading.
- **Testing**: No tests are currently defined. Add test scripts to `package.json` and place tests in a `tests/` folder if needed.
- **Dependencies**: Managed with pnpm. Add with `pnpm add <package>`.

## Integration Points
- **Express**: All HTTP endpoints should be defined via Express routes in `src/api/routes/`.
- **Dotenv**: Load environment variables from `.env`.

## Project-Specific Conventions
- Keep all new code modular and place it in the appropriate subfolder under `src/api/`.
- Avoid placing business logic directly in `server.js` or `app.js`.
- Use ES6+ syntax throughout.
- Document any new patterns or workflows in this file for future agents.

## Example: Adding a Route
1. Create a route file in `src/api/routes/` (e.g., `userRoutes.js`).
2. Define routes and connect to controllers.
3. Import and use the route in `app.js`.

---

_If any conventions or workflows are unclear or missing, please ask for clarification or provide suggestions for improvement._
