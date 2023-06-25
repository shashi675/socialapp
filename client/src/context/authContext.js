import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { Navigate } from "react-router-dom";


export const AuthContext = createContext();
export const AuthContextProvider = ({children}) => {

    const url = "http://localhost:3001/api";
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const login = async (inputs) => {
        const res = await axios.post(url + "/auth/login", inputs, {
            withCredentials: true
        });
        setCurrentUser(res.data);
    };


    const logout = () => {
        localStorage.removeItem("user");
        setCurrentUser(null);
        return <Navigate to="/login" />;
    }

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
    }, [currentUser]);

    return (
        <AuthContext.Provider value={{ currentUser, login, logout, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    )

}