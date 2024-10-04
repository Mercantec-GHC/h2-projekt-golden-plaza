import './Signup.css'
import { useEffect, useState, useContext, useRef } from 'react' // Import the necessary libraries from React
import { KeycloakContext } from '../../App';// Import the KeycloakContext from App.jsx. will allow us to access the keycloak object

function Signup() {
    // Here we accessing the keycloak and init function from the KeycloakContext
    const { init, keycloak, setKeycloak } = useContext(KeycloakContext);

     // Here we have a state variable to check if the keycloak object is initialized
    const [isInitialized, setIsInitialized] = useState(false);

    // Here we have a ref to check if the useEffect has run
    const isRun = useRef(false);

    // the useEffect hook will run when the page/component loads
    useEffect(() => {
        // checks if the useEffect has run or the user is authenticated. if either is true, it will return
        // if the user is not authenticated, it will run the init function and set the isInitialized state to true
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