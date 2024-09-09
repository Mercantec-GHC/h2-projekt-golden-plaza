import './Signup.css'
import InputField from "../../components/Signup & Login/InputField.jsx";
import FormTitle from "../../components/Signup & Login/FormTitle.jsx";
import FormButton from "../../components/Signup & Login/FormButton.jsx";
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';

function Signup() {
    const [email, setEmail] = useState(''); /* useState to keep track of the e-mail provided by the user */
    const [password, setPassword] = useState(''); /* useState to keep track of the password provided by the user */

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log('Form Submitted'); /* Logging this purely to ensure the form is functioning correctly */
        try {
            console.log({email, password});
            await axios.post("http://localhost:5021/api/auth/register", /* Change URL address to your localhost API for authentication */
                {email, password} /* Sends a POST request to the server with the email and password */
            );
            console.log('Register successful'); /* Provides error in console if error occurs */

        } catch (error) {
            console.error('Authentication error:', error.response.data);
        }
    }

    return (
        <div className="backgroundSignup">
        <div className="signup-container">
            <FormTitle title="Sign Up" /> {/* Uses the FormTitle component to make the title of the form. Modify in components/Signup & Login/FormTitle.jsx if wished. */}
            <form onSubmit={handleSubmit}> {/* Calls the handleSubmit function to submit the provided user details to the API */}

                <InputField /* Uses the InputField component to make the input fields for the form. Modify in components/Signup & Login/InputField.jsx if wished. */
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

                <FormButton type="submit" text="Sign Up" /> {/* Uses the FormButton component to make the submit button for the form. Modify in components/Signup & Login/FormButton.jsx if wished. */}
            </form>

            <p>Already have an account? <Link to="/login">Log In</Link></p> {/* Redirects to the Login page if the user already has an account */}
        </div>
        </div>
    )
}

export default Signup