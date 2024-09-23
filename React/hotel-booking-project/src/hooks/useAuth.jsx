import React, {useEffect, useState, useRef } from "react";
import Keycloak from "keycloak-js";

const useAuth = () => {
    const isRun = useRef(false);
    const [token, setToken] = useState(null);
    const [isLogin, setLogin] = useState(false);
    
    useEffect(() => {
        if (isRun.current) return;
        
        isRun.current = true;
        const client = new Keycloak({
            url: "http://localhost:8080/",
            realm: "golden-plaza",
            clientId: "golden-plaza-frontend",
        });
        // client.init({ onLoad: "login-required" }).then((authenticated) => {
        //     setLogin(authenticated);
        //     setToken(client.token);
        // });
    }, []);

    return [isLogin, token];
};

export default useAuth;