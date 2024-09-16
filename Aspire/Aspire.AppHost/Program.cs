var builder = DistributedApplication.CreateBuilder(args);

var api = builder.AddProject<Projects.API>("api");

builder.AddNpmApp("react", "../../React/hotel-booking-project")
    .WithReference(api)
    .WithEnvironment("BROWSER", "none")
    .WithHttpEndpoint(env: "PORT")
    .WithExternalHttpEndpoints()
    .PublishAsDockerFile();

//builder.AddProject<Projects.Blazor>("blazor");

builder.Build().Run();
