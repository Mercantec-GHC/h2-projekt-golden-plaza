import { useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";
import { KeycloakContext } from "../App";

import { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const keycloakRef = useRef<Keycloak.KeycloakInstance | null>(null);
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
    client
      .init({ onLoad: "check-sso", flow: "implicit" })
      .then((authenticated: boolean | ((prevState: boolean) => boolean)) => {
        setIsInitialized(authenticated);
        setIsLoading(false);
      });
  }, []);

  const init = () => {
    if (isInitialized) return Promise.resolve();

    if (!keycloakRef.current)
      return Promise.reject(new Error("Keycloak is not initialized"));
    return keycloakRef.current!.login().then(() => {
      if (
        keycloakRef.current &&
        typeof keycloakRef.current.authenticated === "boolean"
      ) {
        setIsInitialized(keycloakRef.current.authenticated);
      } else {
        setIsInitialized(false);
      }
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
