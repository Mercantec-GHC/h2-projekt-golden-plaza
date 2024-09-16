var builder = DistributedApplication.CreateBuilder(args);

var dbserver = builder.AddPostgres("dbserver");
var db = dbserver.AddDatabase("hoteldb");
dbserver.WithDataVolume().WithPgAdmin();

var api = builder.AddProject<Projects.API>("api").WithReference(db);

builder.AddNpmApp("react", "../../React/hotel-booking-project")
    .WithReference(api)
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

//builder.AddProject<Projects.Blazor>("blazor");

builder.Build().Run();
