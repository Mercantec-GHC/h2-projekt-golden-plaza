var builder = DistributedApplication.CreateBuilder(args);

#region database
// first we add the postgres database server instance
var dbserver = builder.AddPostgres("dbserver");
// then we add the database to the server
var db = dbserver.AddDatabase("hoteldb");
// and atlast we add a volume to the database so our tables persist.
// And we also add pgadmin to the database, so we can administrate the database in the browser through the pgadmin interface
dbserver.WithDataVolume().WithPgAdmin();
#endregion


#region keycloak
// here we add the keycloak server instance, with a bind mount to the keycloak configuration folder, so that we can import the realm and user configuration,
// that way, keycloak will be preconfigured with the realm and users we need.
// here we have also added the data volume, so that the keycloak data persists.
var keycloak = builder.AddKeycloakContainer("keycloak").WithBindMount("KeycloakConfiguration", "/opt/keycloak/data/import").WithDataVolume();
// default login is admin admin ( username: admin, paswword: admin ) can be changed

//adding realm
var realm = keycloak.AddRealm("golden-plaza");
#endregion


// here we add the api project, with a reference to the database and keycloak server(and realm)
// the WithReference method functions like a docker-compose depends_on, so that the api project will only start after the database and keycloak server is up and running
var api = builder.AddProject<Projects.API>("api").WithReference(db).WithReference(keycloak).WithReference(realm);



#region frontend
// here we add the customer frontend project, with a reference to the api project, aswell as the keycloak server(and realm).
// the WithEnvironment method is used to set the BROWSER environment variable to none, so that the customer frontend project will not open a browser window when it starts.
// the WithHttpEndpoint method is used to set the PORT environment variable to the port that the customer frontend project should listen on.
// the WithExternalHttpEndpoints method is used to expose the customer frontend project to the outside world.
// the PublishAsDockerFile method is used to publish the customer frontend project as a dockerfile.
builder.AddNpmApp("frontend", "../../React/hotel-booking-project")
    .WithReference(api)
    .WithReference(keycloak)
    .WithReference(realm)
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

// here we add the admin panel project, with a reference to the api project, aswell as the keycloak server(and realm).
// the WithEnvironment method is used to set the BROWSER environment variable to none, so that the admin panel project will not open a browser window when it starts.
// the WithHttpEndpoint method is used to set the PORT environment variable to the port that the admin panel project should listen on.
// the WithExternalHttpEndpoints method is used to expose the admin panel project to the outside world.
// the PublishAsDockerFile method is used to publish the admin panel project as a dockerfile.
builder.AddNpmApp("admin-panel", "../../React/admin-panel")
    .WithReference(api)
    .WithReference(keycloak)
    .WithReference(realm)
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

#endregion
//builder.AddProject<Projects.Blazor>("blazor");

builder.Build().Run();
