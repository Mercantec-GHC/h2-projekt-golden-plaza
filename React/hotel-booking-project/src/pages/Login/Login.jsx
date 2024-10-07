import './Login.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useContext, useRef } from 'react' // Import the necessary libraries from React
import { KeycloakContext } from '../../App'; // Import the KeycloakContext from App.jsx. will allow us to access the keycloak object

function Login() {

    // Here we are using the useNavigate hook to navigate to different pages
    const navigate = useNavigate();

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
        if (isRun.current) return;

        if (keycloak && keycloak.authenticated) {
            setIsInitialized(true);
            
            // If user is authenticated, navigate to the home page
            navigate('/');
        }
        
        isRun.current = true;
        init();
        setIsInitialized(true);

    }, [keycloak, init, isInitialized]);


    return (
        <div >
        </div>
    );
}

export default Login
