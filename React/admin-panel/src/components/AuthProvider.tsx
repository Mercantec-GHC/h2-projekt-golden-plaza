import { useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";
import { KeycloakContext } from "../App";
import { ReactNode } from "react";

// Interface for props that the AuthProvider component will accept
interface AuthProviderProps {
  children: ReactNode; // ReactNode represents any valid React child (e.g., JSX, string, etc.)
}

// AuthProvider is a wrapper component that provides Keycloak authentication to its children via context.
function AuthProvider({ children }: AuthProviderProps) {
  // useRef to store a reference to the Keycloak instance. Initially, it is set to null.
  const keycloakRef = useRef<Keycloak.KeycloakInstance | null>(null);

  // State to track if Keycloak is initialized (authentication status)
  const [isInitialized, setIsInitialized] = useState(false);

  // State to track if the Keycloak instance is still being loaded
  const [isLoading, setIsLoading] = useState(true);

  // useEffect hook to initialize Keycloak on component mount
  useEffect(() => {
    // Prevent re-initialization if Keycloak is already initialized
    if (keycloakRef.current) return;

    // Create a new Keycloak instance with configuration parameters
    const client = new Keycloak({
      url: "http://localhost:8080/", // Keycloak server URL
      realm: "golden-plaza", // Keycloak realm name
      clientId: "golden-plaza", // Client ID in Keycloak for this app
    });

    keycloakRef.current = client; // Store the Keycloak instance in the ref

    // Initialize Keycloak with specific settings (check-sso: check single sign-on status)
    client
      .init({ onLoad: "check-sso", flow: "implicit" })
      .then((authenticated: boolean) => {
        // Update the initialization state based on whether the user is authenticated
        setIsInitialized(authenticated);
        // Once initialization is complete, stop the loading state
        setIsLoading(false);
      });
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  // Function to trigger a manual login if Keycloak is not yet initialized
  const init = () => {
    // If already initialized (authenticated), return a resolved promise
    if (isInitialized) return Promise.resolve();

    // If Keycloak hasn't been initialized, reject the promise with an error
    if (!keycloakRef.current)
      return Promise.reject(new Error("Keycloak is not initialized"));

    // Trigger the Keycloak login and update the authentication state accordingly
    return keycloakRef.current!.login().then(() => {
      if (
        keycloakRef.current &&
        typeof keycloakRef.current.authenticated === "boolean"
      ) {
        // Set initialization state based on Keycloak's authentication state
        setIsInitialized(keycloakRef.current.authenticated);
      } else {
        // If no authentication state is found, assume not initialized
        setIsInitialized(false);
      }
    });
  };

  // While Keycloak is still loading, show a loading message
  if (isLoading) return <div>Loading...</div>;

  // Provide the Keycloak instance and init function to the child components via context
  return (
    <KeycloakContext.Provider value={{ keycloak: keycloakRef.current, init }}>
      {children}{" "}
      {/* Render child components inside the Keycloak context provider */}
    </KeycloakContext.Provider>
  );
}

export default AuthProvider;
