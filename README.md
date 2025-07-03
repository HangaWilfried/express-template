# Express.js & TypeScript API Template

This project serves as a robust and scalable boilerplate for building RESTful APIs using Express.js and TypeScript. It comes pre-configured with essential tools and practices to kickstart your backend development.

## Features

-   **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
-   **TypeScript**: Enhances code quality and maintainability with static typing.
-   **Prisma ORM**: Modern database toolkit for Node.js and TypeScript, providing type-safe database access.
-   **Authentication**: Secure user authentication using JWT (JSON Web Tokens) and Passport.js, with Argon2 for password hashing.
-   **User Management**: Basic user creation and management functionalities.
-   **Zod**: Schema declaration and validation library for ensuring data integrity.
-   **Pino**: Highly performant and developer-friendly logger.
-   **Error Handling**: Centralized error handling middleware for consistent API responses.
-   **Environment Variables**: Secure configuration management using `dotenv`.
-   **CORS**: Cross-Origin Resource Sharing enabled.
-   **Code Formatting**: Integrated with Prettier for consistent code style.
-   **Linting**: Configured with Oxlint/ESLint for identifying and fixing code quality issues.
-   **Development Workflow**: Hot-reloading development server with `tsx` for a smooth development experience.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Make sure you have the following installed:

-   Node.js (LTS version recommended)
-   npm or Yarn
-   Docker (for running the database)

### Installation

1.  Clone the repository:

    ```bash
    git clone git@github.com:HangaWilfried/express-template.git
    cd express-template
    ```

2.  Install dependencies:

    ```bash
    npm install
    # or
    yarn install
    ```

### Environment Variables

Create a `.env` file in the root of the project based on the `.env.example` (if available, otherwise create one with the following):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/database_name?schema=public"
JWT_SECRET="your_jwt_secret_key"
# Add any other environment variables your application needs
```

**Note**: Replace the placeholder values with your actual database connection string and a strong JWT secret.

### Database Setup

This project uses Prisma with a PostgreSQL database (configured via `docker-compose.yml`).

1.  Start the database container:

    ```bash
    docker compose up -d
    ```

2.  Run Prisma migrations to set up your database schema:

    ```bash
    npx prisma migrate dev --name init
    ```

3.  Generate Prisma client:

    ```bash
    npx prisma generate
    ```

### Running the Application

#### Development Mode

To run the application in development mode with hot-reloading:

```bash
npm run dev
# or
yarn dev
```

The API server will typically run on `http://localhost:3000` (or the port specified in your configuration).

#### Production Mode

1.  Build the TypeScript project:

    ```bash
    npm run build
    # or
    yarn build
    ```

2.  Serve the compiled JavaScript:

    ```bash
    npm run serve
    # or
    yarn serve
    ```

## Code Quality

### Formatting

To format your code using Prettier:

```bash
npm run format
# or
yarn format
```

### Linting

To run the linter:

```bash
npm run lint
# or
yarn lint
```

## Project Structure

```
.editorconfig
.env
.gitignore
.oxlintrc.json
.prettierrc.json
docker-compose.yml
Dockerfile
package.json
README.md
tsconfig.json
prisma/
├───schema.prisma
└───migrations/
src/
├───config.ts
├───index.ts
├───errors/
│   ├───AppError.ts
│   └───PrismaErrorConverter.ts
├───features/
│   ├───auth/
│   │   ├───auth.routes.ts
│   │   ├───auth.schema.ts
│   │   └───auth.service.ts
│   └───user/
│       ├───user.routes.ts
│       ├───user.schema.ts
│       └───user.service.ts
├───middlewares/
│   ├───auth.middleware.ts
│   ├───error.middleware.ts
│   ├───handler.middleware.ts
│   └───validators.middleware.ts
├───types/
│   └───express.d.ts
└───utils/
    ├───logger.ts
    ├───orm.ts
    └───token.ts
```

## Contributing

Feel free to fork this repository and contribute! Please ensure your contributions adhere to the existing code style and conventions.

## License

This project is licensed under the ISC License. See the `LICENSE` file for details. (Note: A `LICENSE` file is not included in the provided structure, you may want to add one.)
