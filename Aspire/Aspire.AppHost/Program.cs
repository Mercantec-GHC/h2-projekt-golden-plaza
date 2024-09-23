var builder = DistributedApplication.CreateBuilder(args);

var dbserver = builder.AddPostgres("dbserver");
var db = dbserver.AddDatabase("hoteldb");
dbserver.WithDataVolume().WithPgAdmin();


// if keycloak fails, add the port number to it like this
// var keycloak = builder.AddKeycloakContainer("keycloak", port: 8080).WithDataVolume();
// default login is admin admin ( username: admin, paswword: admin ) can be changed
var keycloak = builder.AddKeycloakContainer("keycloak").WithDataVolume();

var api = builder.AddProject<Projects.API>("api").WithReference(db);

builder.AddNpmApp("frontend", "../../React/hotel-booking-project")
    .WithReference(api)
    .WithReference(keycloak)
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

builder.AddNpmApp("admin-panel", "../../React/admin-panel")
    .WithReference(api)
    .WithReference(keycloak)
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

//builder.AddProject<Projects.Blazor>("blazor");

builder.Build().Run();
