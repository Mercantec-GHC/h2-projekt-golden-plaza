import './Signup.css'
import InputField from "../../components/Signup & Login/InputField.jsx";
import FormTitle from "../../components/Signup & Login/FormTitle.jsx";
import FormButton from "../../components/Signup & Login/FormButton.jsx";
import React, { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
    const [formData, setFormData] = useState({
        name: '',
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
        <div className="signup-container">
            <FormTitle title="Sign Up" />
            <form onSubmit={handleSubmit}>
                <InputField
                    labelText="Name"
                    inputType="text"
                    inputId="name"
                    inputName="name"
                    value={formData.name}
                    onChange={handleChange}
                />

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

                <FormButton type="submit" text="Sign Up" />
            </form>

            <p>Already have an account? <Link to="/login">Log In</Link></p>
        </div>
    )
}

export default Signup
