import './Login.css'
import InputField from "../../components/Signup & Login/InputField.jsx";
import FormTitle from "../../components/Signup & Login/FormTitle.jsx";
import FormButton from "../../components/Signup & Login/FormButton.jsx";
import { useEffect, useState, useContext, useRef } from 'react'
import { KeycloakContext } from '../../App';

function Login() {
    const [email, setEmail] = useState(''); /* useState to keep track of the e-mail provided by the user */
    const [password, setPassword] = useState(''); /* useState to keep track of the password provided by the user */
    const { init, keycloak, setKeycloak } = useContext(KeycloakContext);
    const [isInitialized, setIsInitialized] = useState(false);
    const isRun = useRef(false);

    useEffect(() => {
        if (isRun.current || keycloak.authenticated) return;
        
        isRun.current = true;
        init();
        setIsInitialized(true);

    }, [keycloak, init, isInitialized]);

    
    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('Form Submitted') /* Logging this purely to ensure the form is functioning correctly */
        try {
            if (email !== "" && password !== "")
            {
                auth.loginUser(email, password);
                return;
            }
        } catch (error) {
            console.error('Authentication error:', error.response.data); /* Provides error in console if error occurs */
        }
    }


    return (
        <div className="backgroundLogin">

            <div className="login-container">
            {

                (keycloak?.authenticated) ? <h1>Logged in</h1> :
                (<>

                    <FormTitle title="Log In" /> {/* Uses the FormTitle component to make the title of the form. Modify in components/Signup & Login/FormTitle.jsx if wished. */}
                    <form onSubmit={handleSubmit}> {/* Calls the handleSubmit function to submit the provided user details to the API */}

                    <InputField 
                        labelText="Email"
                        inputType="email"
                        inputId="email"
                        inputName="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />

                    <InputField
                        labelText="Password"
                        inputType="password"
                        inputId="password"
                        inputName="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />

                    <FormButton type="submit" text="Log In" /> {/* Uses the FormButton component to make the submit button for the form. Modify in components/Signup & Login/FormButton.jsx if wished. */}
                    </form>
                        </>
                )
            }
            </div>
        </div>
    );
}

export default Login
