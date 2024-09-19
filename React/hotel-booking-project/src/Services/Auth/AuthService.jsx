import axios from "axios";


const api = "https://localhost:7207/";

export const loginApi = async (email, password) => {
    try {
        const data = await axios.post(api + "api/Auth/login", {
            email: email,
            password: password,
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}; 


export const registerApi = async (email, username, password) => {
    try {
        const data = await axios.post(api + "api/Auth/register", {
            email: email,
            username: username,
            password: password,
        });
        return data;
    } catch (error) {
        console.log(error);
    }
}; 


