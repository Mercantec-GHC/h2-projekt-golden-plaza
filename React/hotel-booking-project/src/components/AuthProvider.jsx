import { useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";
import { KeycloakContext } from "../App";

// AuthProvider component is responsible for initializing and managing Keycloak authentication.
// It wraps around the child components, providing them access to Keycloak via context.
function AuthProvider({ children }) {

    // useRef to hold the Keycloak instance, initialized once and persisted across renders
    const keycloakRef = useRef(null);

    // State to track whether Keycloak has been initialized (i.e., authenticated or not)
    const [isInitialized, setIsInitialized] = useState(false);

    // State to track if the Keycloak initialization process is still ongoing
    const [isLoading, setIsLoading] = useState(true);

    // useEffect hook is responsible for initializing the Keycloak client when the component is mounted. It runs only once (empty dependency array).
    useEffect(() => {
        // Prevents reinitialization of Keycloak if it's already set
        if (keycloakRef.current) return;

        // Create a new Keycloak instance with configuration parameters (URL, realm, clientId)
        const client = new Keycloak({
            url: "http://localhost:8080/", // The Keycloak server URL
            realm: "golden-plaza", // The realm name in Keycloak
            clientId: "golden-plaza", // The client ID for the application in the Keycloak realm
        });

        // Assign the Keycloak client to the keycloakRef
        keycloakRef.current = client;

        // Initialize Keycloak client with check-sso to check Single Sign-On status. The flow 'implicit' is used for handling authentication.
        // Sets the initialization state based on authentication status.
        client.init({ onLoad: 'check-sso', flow: 'implicit' }).then(authenticated => {
            
            // Set whether the user is authenticated (initialized) or not
            setIsInitialized(authenticated);

            // Once initialization is complete, set loading to false
            setIsLoading(false);
        });
    }, []); // Empty dependency array ensures this effect runs only once, when the component mounts


    // init function is used to explicitly trigger a login process with Keycloak if the user hasn't been authenticated yet. 
    // It returns a promise that resolves once the login process completes.
    const init = () => {
        // If already initialized (authenticated), resolve immediately to avoid unnecessary login
        if (isInitialized) return Promise.resolve();

        // Trigger Keycloak login process and update the state based on authentication status
        return keycloakRef.current.login().then(() => {
            setIsInitialized(keycloakRef.current.authenticated);
        });
    };

    // If Keycloak is still loading (hasn't finished initialization), display a loading screen to the user.
    if (isLoading) return <div>Loading...</div>;

    // Once Keycloak has initialized, provide the keycloak instance and the init function through context to child components.
    return (
        <KeycloakContext.Provider value={{ keycloak: keycloakRef.current, init }}>
            {children} {/* Render the child components inside the provider */}
        </KeycloakContext.Provider>
    );
}

export default AuthProvider;
