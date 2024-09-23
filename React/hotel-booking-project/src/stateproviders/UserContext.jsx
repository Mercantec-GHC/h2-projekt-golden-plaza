import { createContext } from "react";


export const UserContext = createContext({ isLogin: false, token: "" }); // Create a UserContext