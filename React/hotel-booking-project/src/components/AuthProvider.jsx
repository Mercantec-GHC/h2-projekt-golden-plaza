import { useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";
import { KeycloakContext } from "../App";

function AuthProvider({ children }) {
    const keycloakRef = useRef(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (keycloakRef.current) return;

        const client = new Keycloak({
            url: "http://localhost:8080/",
            realm: "golden-plaza",
            clientId: "golden-plaza",
        });
        keycloakRef.current = client;
        client.init({ onLoad: 'check-sso', flow: 'implicit' }).then(authenticated => {
            setIsInitialized(authenticated);
            setIsLoading(false);
        });
    }, []);

    const init = () => {
        if (isInitialized) return Promise.resolve();

        return keycloakRef.current.login().then(() => {
            setIsInitialized(keycloakRef.current.authenticated);
        });
    };

    if (isLoading) return <div>Loading...</div>;

    return (
        <KeycloakContext.Provider value={{ keycloak: keycloakRef.current, init }}>
            {children}
        </KeycloakContext.Provider>
    );
}

export default AuthProvider;