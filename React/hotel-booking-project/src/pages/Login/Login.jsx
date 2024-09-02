import './Login.css'
import InputField from "../../components/Signup & Login/InputField.jsx";
import FormTitle from "../../components/Signup & Login/FormTitle.jsx";
import FormButton from "../../components/Signup & Login/FormButton.jsx";
import { useState } from 'react'

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Form Submitted')
    }

    return (
        <div className="login-container">
            <FormTitle title="Log In" />
            <form onSubmit={handleSubmit}>

                <InputField
                    labelText="Email"
                    inputType="email"
                    inputId="email"
                    inputName="email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <InputField
                    labelText="Password"
                    inputType="password"
                    inputId="password"
                    inputName="password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <FormButton type="submit" text="Log In" />
            </form>
        </div>
    )
}

export default Login
