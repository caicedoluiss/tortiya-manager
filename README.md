# TortiYa Manager

This is a web solution for my tortilla-making venture. It allows me to record sales, manage inventory, and review financial performance efficiently.

## Getting Started 🛠

This solution consists of three main components that must be running for the system to function properly:

1. **Azure Cosmos DB** – NoSQL database for data storage.
2. **Web API** – Backend service handling business logic and data processing.
3. **Web App** – Frontend application interacting with the API.

### Running the Solution 🚀

Follow the guide to run each of the components

#### Azure CosmosDb NoSql Db

You need an Azure CosmosDb NoSql Account created in your azure account and get the _AccountEndpoint_ and _AccountKey_ values to be able to access it from the API. No database, container or any configuration is required to exist.

#### WebAPI

##### Requirements

-   .NET 8
-   Azure CosmosDb NoSql Account

Set up the CosmosDb required configuration in `./server/TortiYaManager.WebAPI/appsetings.json` file, with this specific information (Do not track changes in this file, run `git update-index --assume-unchanged ./server/TortiYaManager.WebAPI/appsettings.json` untrack changes, use `appsettings.example.json` instead to leave any configuration requirement reference):

```json
"CosmosDbSettings": {
    "DbName": "Db Name",
    "AccountEndpoint": "https://account.azure.endpoint/",
    "AccountKey": "Access Key from resource settings"
}
```

From vscode, open a terminal in the WebAPI project and run `dotnet run -- migrate`.
This will prepare and seed the db (No actual migrations executed as this is a document based Non-Relation db). **It´s mandatory if your running the solution the first time.**

Then you can run the project as prefered, any of the following methods below:

-   By using the **Run and Debug** vscode option over _.Net Core Launch (web) (TortiYaManager.WebAPI)_
-   running `dotnet run`
-   running `dotnet watch`

The Swagger web interface should be displayed.

#### WebApp

##### Requirements

-   Node 22.16.x

1. Install all the node dependencies by running `npm i`.

2. Create an _.env.local_ file inside `./client/WebApp/` directory and set all the variables found in _.env_ file. For the _API_URL_ you have to setup the url of the WebAPI including **/api** path part at the end: `http://localhost:<port>/api`

3. Execute the dev script by running `npm run dev`

### Run solution using Docker (Optional)

You can use docker to run container for running the WebAPI, WebApp and a "Migrations Job" used for setting up database, by using docker compose.

##### Requirements

-   Docker
-   Azure CosmosDb NoSql Account

1. In root folder find the `docker-compose.yaml` file to edit the environment variables for the **api** and **migrations_job** services with the Azure CosmosDb NoSql Account and database Name:

```yaml
services:
    migrations_job:
        environment:
            - CosmosDbSettings__DbName=
            - CosmosDbSettings__AccountEndpoint=
            - CosmosDbSettings__AccountKey=
    api:
        environment:
            - CosmosDbSettings__DbName=
            - CosmosDbSettings__AccountEndpoint=
            - CosmosDbSettings__AccountKey=
```

_Make sure to not commit any secret value when making changes. Keep these changes locally._

2. Run `docker compose up --build` in root folder.

-   _migrations_job_ only runs once, it finishes automatically.
-   _api_ runs after _migrations_job_ process finishes and can be accesed through port 8080 `http://localhost:8080/`
-   _webapp_ can be accesed through port 8081 `http://localhost:8081/`

## Documentation topics

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
