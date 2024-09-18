import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginApi, registerApi } from "./AuthService";
import React from "react"
import axios from "axios";
import { jwtDecode } from 'jwt-decode'



const UserContext = createContext();
const emailaddress = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress";
const nameIdentifier = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier";

export const UserProvider = ( { children }) => {
    const navigate = useNavigate();
    const [token, setToken] = useState("");
    const [user, setUser] = useState("");
    
    useEffect(() =>
    {
        const user = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if ( user && token )
        {
            setUser(JSON.parse(user));
            setToken(token);
            axios.defaults.headers.common["Authorization"] = "Bearer " + token;
        }
    }, []);

    const registerUser = async (
        email,
        username,
        password,
    ) =>
    {
        await registerApi(email, username, password).then((res) => {
            if (res){
                localStorage.setItem("token", res?.data.Token);
                const UserOBJ = {
                    Username: res?.data.Username,
                    Email: res?.data.Email
                };
                localStorage.setItem("user", JSON.stringify(UserOBJ));
                setToken(res?.data.Token);
                setUser(UserOBJ);
                navigate("/"); 
            }
        }).catch((e) => console.log("Server error occured"));
    };

    const loginUser = async (
        email,
        password
    ) =>
    {
        await loginApi(email, password).then((res) => {
            if (res){
                localStorage.setItem("token", res?.data);
                const tokenJWT = jwtDecode(res?.data);
                console.log(tokenJWT);
                const UserOBJ = {
                    Email: tokenJWT[emailaddress],
                    NameIdentitfier: tokenJWT[nameIdentifier]
                };
                localStorage.setItem("user", JSON.stringify(UserOBJ));
                setToken(res?.data);
                setUser(UserOBJ);
                navigate("/"); 
            }
        }).catch((e) => console.log(e));
    };

    const isLoggedIn = () => {
        return !!user;
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser("");
        setToken("");
        navigate("/");
    }

    return (
        <UserContext.Provider value={{ loginUser, user, token, logout, isLoggedIn, registerUser }}>
             {children}
        </UserContext.Provider>
    );

};
export default UserProvider;
export const useAuth = () => React.useContext(UserContext);