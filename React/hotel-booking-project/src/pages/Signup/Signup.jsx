import './Signup.css'
import { useEffect, useState, useContext, useRef } from 'react'
import { KeycloakContext } from '../../App';

function Signup() {

    const { init, keycloak, setKeycloak } = useContext(KeycloakContext);
    const [isInitialized, setIsInitialized] = useState(false);
    const isRun = useRef(false);


    useEffect(() => {
        if (isRun.current || keycloak.authenticated) return;
        
        isRun.current = true;
        init();
        setIsInitialized(true);

    }, [keycloak, init, isInitialized]);


    return (
        <div>
        </div>
    )
}

export default Signup