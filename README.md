# TortiYa Manager

This is a web solution for my tortilla-making venture. It allows me to record sales, manage inventory, and review financial performance efficiently.

In addition to its core functionalities, this solution is built with a modern architecture and widely adopted technologies:

-   **Frontend:** Developed with React, leveraging Vite for fast and efficient development, and TypeScript for enhanced code robustness and maintainability. For styling, [Material UI](https://mui.com/) is used to provide a modern and consistent user interface.
-   **Backend:** Implemented in .NET 8, enabling efficient business logic handling and integration with various services.
-   **Database:** Utilizes both NoSQL databases (Azure Cosmos DB) for flexible and scalable storage, and SQL (SQL Server) for scenarios requiring structured relationships. The solution leverages the Entity Framework Core code-first approach, allowing database schema and data models to be defined and managed through C# classes and migrations (if applies) for both Cosmos DB and SQL Server.
-   **Cloud Services:** Relies on Azure services for data management and infrastructure, supporting scalability and high availability.
-   **Authentication and Security:** User authentication is managed using .NET Identity with JWT (JSON Web Tokens), ensuring secure and controlled access to the application.
-   **Containerization and DevOps:** Docker is used for containerizing the application's components, enabling consistent environments across development, testing, and production. This facilitates DevOps practices such as automated deployments, CI/CD pipelines, and infrastructure as code.

## Architecture and Design Patterns

TortiYa Manager is structured using a modular architecture that promotes maintainability and scalability:

-   **Clean Architecture:** The solution is organized into separate layers (Presentation, Application, Domain, Infrastructure) to ensure clear separation of concerns.
-   **Repository Pattern:** Data access is abstracted using repositories, allowing flexible integration with Cosmos DB and SQL Server.
-   **Dependency Injection:** Services and dependencies are injected throughout the application to improve testability and reduce coupling.
-   **Asynchronous Programming:** Both backend and frontend use async/await patterns for non-blocking operations and better performance.
-   **Configuration Management:** Sensitive settings and environment-specific configurations are managed via environment variables and configuration files.
-   **API Documentation:** The WebAPI is documented using Swagger/OpenAPI for clear and interactive API references.
-   **CQRS and Mediator Pattern:** The solution adopts the Command Query Responsibility Segregation (CQRS) pattern to separate read and write operations, improving scalability and maintainability. A custom implementation of the Mediator pattern is used for handling queries and commands, decoupling request handling and promoting a clean, organized codebase.

These architectural choices and best practices ensure that TortiYa Manager is robust, maintainable, and ready for future growth.

## Getting Started 🛠

This solution is divided into multiple components that must be running for the solution to work properly:

1. **Azure Cosmos DB** – NoSQL database for data storage.
2. **SQL Server DB** - SQL database for authentication service.
3. **Web API** – Backend service handling business logic and data processing.
4. **Web App** – Frontend application interacting with the API.

There are two main ways to run the solution:

1.  **Running the solution as individual components** – See the [instructions below](#running-the-solution-as-individual-components).

    > This approach offers greater flexibility for debugging and making changes during development. Running each component individually allows you to isolate issues, apply code updates quickly, and test specific services without rebuilding or restarting the entire solution. This is especially useful when iterating on features or troubleshooting problems in a local environment.

2.  **Running the entire solution using Docker Compose** – See the [Docker Compose instructions](#run-solution-using-docker).

        > This all-in-one Docker Compose approach is especially useful when you want to quickly spin up the entire solution—including the backend, frontend, and supporting services—without manually configuring each component. It is ideal for local development, testing, onboarding new team members, or setting up demo environments, as it ensures consistency and reduces setup time by orchestrating all dependencies with a single command.

<u>For both approaches, you must have an active Azure Cosmos DB account provisioned in the cloud. It's the only cloud service dependency for local development.</u>

### Running the Solution as individual components

Follow the guide to run each of the components

#### Azure Cosmos DB NoSql Database

You need an Azure Cosmos DB NoSql Account created in your azure account and get the _AccountEndpoint_ and _AccountKey_ values to be able to access it from the API. No database, container or any configuration is required to exist.

#### WebAPI

##### Requirements

-   .NET 8
-   Azure Cosmos DB NoSql Account
-   SQL Server or Docker

Set up the Cosmos DB required configuration in `./server/TortiYaManager.WebAPI/appsettings.json` file.

```json
"CosmosDbSettings": {
    "DbName": "Db Name",
    "AccountEndpoint": "https://account.azure.endpoint/",
    "AccountKey": "Access Key from resource settings"
}
```

You must also configure the `JwtSettings` section in the `appsettings.json` file. For example:

```json
"JwtSettings": {
    "Issuer": "your-issuer",
    "Audience": "your-audience",
    "Secret": "your-secret-key",
    "TtlMinutes": 15 // Token time to live or expiration time in minutes.
}
```

Do not track changes in this file, run `git update-index --assume-unchanged ./server/TortiYaManager.WebAPI/appsettings.json` to untrack changes, use `appsettings.example.json` instead to leave any configuration requirement reference.

Make sure to replace these values with those appropriate for your environment and keep the secrets secure.

#### Running WebAPI using Docker

> **Note:** This step is only required if you are using Docker or have Docker installed on your system. If you prefer not to use Docker, see [Running WebAPI without Docker](#running-webapi-without-docker).

To set up the SQL Server database required for authentication, use the `docker-compose.yaml` file located in the `./server/TortiYaManager.WebAPI/` directory. This file will start a container for SQL Server and the `migrations_job` service, which initializes and seeds the databases.

You must also set the environment variables for `CosmosDbSettings` in the `docker-compose.yaml` file for the `migrations_job` service. Use the same values you configured earlier in your `appsettings.json` file (`DbName`, `AccountEndpoint`, and `AccountKey`). This ensures the migration job can access your Azure Cosmos DB instance with the correct credentials.

For more details on managing database migrations, see the [Database Migrations](#database-migrations) section below.

```yaml
...
services:
    ...
    migrations_job:
        ...
        environment:
            ...
            - CosmosDbSettings__DbName=
            - CosmosDbSettings__AccountEndpoint=
            - CosmosDbSettings__AccountKey=
```

Replace the values with your actual Azure Cosmos DB and SQL Server credentials.

> **Note:** The connection string for the Migrations Job is preconfigured to connect to the SQL Server container by default:

```yaml
...
services:
    ...
    migrations_job:
        ...
        environment:
            - ...
            - ConnectionStrings__SqlDb=Server=tortiya_manager-debug_db-sql;Database=TortiYaManager;User Id=sa;Password=P@55word;TrustServerCertificate=True;
```

Run the following command from the `./server/TortiYaManager.WebAPI/` directory:

```bash
docker compose up --build
```

This will:

-   Start a SQL Server container for the authentication database.
-   Run the `migrations_job` container to apply migrations setup and seed databases automatically.

<u>_Ensure you have Docker installed and configured before running this command._</u>
Finally, you must configure the `ConnectionStrings:SqlDb` setting in your `appsettings.json` file to point to the SQL Server container. In this case, the `Server` should be set to `localhost` since the container is accessible from your host machine. For example:

```json
"ConnectionStrings": {
    "SqlDb": "Server=localhost;Database=TortiYaManager;User Id=sa;Password=P@55word;TrustServerCertificate=True;"
}
```

Make sure to update this connection string with the correct credentials and database name as needed for your environment.

Then you can run the WebAPI project as prefered, any of the following methods below:

-   By using the **Run and Debug** vscode option over _.Net Core Launch (web) (TortiYaManager.WebAPI)_
-   running `dotnet run`
-   running `dotnet watch`

The Swagger web interface should be displayed.

### Running WebAPI without Docker

If you prefer not to use Docker, you can manually run each component by following these steps:

1. **SQL Server:**
   Ensure you have a running SQL Server instance and configure the appropriate connection string in the WebAPI's `appsettings.json` file.

```json
"ConnectionStrings": {
    "SqlDb": "Server=<your server location>;Database=TortiYaManager;User Id=<your user>;Password=<your password>;TrustServerCertificate=True;"
}
```

2. **WebAPI:** From the WebAPI project folder `./server/TortiYaManager.WebAPI/`, run `dotnet run migrate` <u>**This is mandatory if you're running the solution the first time or when executing new migrations.**</u>. For more details on managing database migrations, see the [Database Migrations](#database-migrations) section below.

Then you can run the project as prefered, any of the following methods below:

-   By using the **Run and Debug** vscode option over _.Net Core Launch (web) (TortiYaManager.WebAPI)_
-   running `dotnet run`
-   running `dotnet watch`

The Swagger web interface should be displayed.

This way, you can run the entire solution without relying on Docker containers.

#### WebApp

##### Requirements

-   Node 22.16.x

1. Install all the node dependencies by running `npm i`.

2. Create an _.env.local_ file inside `./client/WebApp/` directory and set all the variables found in _.env_ file. For the _API_URL_ you have to setup the url of the WebAPI including **/api** path part at the end: `http://localhost:<port>/api`

3. Execute the dev script by running `npm run dev`

### Run solution using Docker

You can use docker to run container for running the WebAPI, WebApp and a "Migrations Job" used for setting up database, by using docker compose.

##### Requirements

-   Docker
-   Azure Cosmos DB NoSql Account

1. In root folder find the `docker-compose.yaml` file to edit the environment variables for the **api** and **migrations_job**, some of them may be preconfigured by default:

```yaml
...
services:
    ...
    migrations_job:
        ...
        environment:
            - CosmosDbSettings__DbName=
            - CosmosDbSettings__AccountEndpoint=
            - CosmosDbSettings__AccountKey=
            - JwtSettings__Issuer=
            - JwtSettings__Audience=
            - JwtSettings__Secret=
            - JwtSettings__TtlMinutes=
            - ConnectionStrings__SqlDb=
    api:
        ...
        environment:
            - CosmosDbSettings__DbName=
            - CosmosDbSettings__AccountEndpoint=
            - CosmosDbSettings__AccountKey=
            - JwtSettings__Issuer=
            - JwtSettings__Audience=
            - JwtSettings__Secret=
            - JwtSettings__TtlMinutes=
            - ConnectionStrings__SqlDb=
    ...
```

_Make sure to not commit any secret value when making changes. Keep these changes locally._

2. Run `docker compose up --build` in root folder.

-   _sql_ starts a new SQL Server for SQL database.
-   _migrations_job_ only runs once after _sql_, it finishes automatically.
-   _api_ runs after _migrations_job_ process finishes and can be accesed through port 8080 `http://localhost:8080/`
-   _webapp_ can be accesed through port 8081 `http://localhost:8081/`

## Documentation topics

### Database Migrations

#### Cosmos DB

For Cosmos DB, no traditional migrations are required since this is a document based database (NoSql). When the application starts, it checks if the specified database exists. If it does not, the application automatically creates the database and initializes it with seed data. This ensures that the necessary collections and initial data are available without manual intervention.

#### SQL Server

For the SQL Server database (used for authentication), Entity Framework Core migrations are used to manage schema changes. Migrations are created and applied from the WebAPI project.

> **Note:** To work with migrations, you need to have the EF Core CLI tools installed. You can install them globally using the command: `dotnet tool install --global dotnet-ef`
>
> For more information, see the [official EF Core tools documentation](https://learn.microsoft.com/en-us/ef/core/cli/dotnet).

To update the EF Core CLI tools to the latest version, use:

```bash
dotnet tool update --global dotnet-ef
```

Additionally, ensure that the main (startup) project references the `Microsoft.EntityFrameworkCore.Design` package. This is required for design-time operations such as migrations.

To create a new migration (for example, the initial migration), run the following command from the `./server/TortiYaManager.WebAPI/` directory:

```bash
dotnet ef migrations add Initial --project ..\TortiYaManager.Infrastructure\TortiYaManager.Infrastructure.csproj --context AuthDbContext
```

-   `Initial` is the name of the migration. You can change it as needed.
-   The `--project` option points to the Infrastructure project where the DbContext is defined.
-   The `--context` option specifies the DbContext to use (`AuthDbContext` for authentication).

**What this command does:**

-   Scans your entity models and compares them to the current database schema.
-   Generates a migration file that contains the necessary SQL commands to bring the database schema up to date with your models.
-   The migration file is placed in the `Migrations` folder of the Infrastructure project.

**Applying migrations:**

Migrations are automatically applied when you run the migration job container (see Docker instructions) or when you run the WebAPI project with the `migrate` argument:

```bash
dotnet run migrate
```

This ensures your SQL Server database is always up to date with the latest schema changes.

### WebAPI Environment

The WebAPI project is configure to manage different environments:

-   Production
-   Staging
-   Development
-   Local
-   Debug

Each env name describe it's own prupose, the difference between Local and Debug is that _Local_ is meant to be when all the infrastructure (including database) is deployed in a local environment, otherwise should be _Debug_.

Environment can be set on the `ASPNETCORE_ENVIRONMENT` environment variable. For more information on configuring ASP.NET Core environments and settings, see the [official documentation on configuration sources](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/configuration/?view=aspnetcore-9.0#default-host-configuration-sources).

### WebAPI Port

As in .NET 8 the default port for ASP.NET was updated from 80 to 8080. Now it's required to specify the port you want the application to run by setting the environment variable `ASPNETCORE_HTTP_PORTS` if you don't want to use the default one. For more details, see the [.NET 8 ASP.NET Core default port change documentation](https://learn.microsoft.com/en-us/dotnet/core/compatibility/containers/8.0/aspnet-port).
