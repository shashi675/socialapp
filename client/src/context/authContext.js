import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import { Navigate } from "react-router-dom";


export const AuthContext = createContext();
export const AuthContextProvider = ({children}) => {

    const url = process.env.REACT_APP_BACKEND_URL;
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );

    const [isLoading, setIsLoading] = useState(false);

    const login = async (inputs) => {
        setIsLoading(true);
        const res = await axios.post(url + "/auth/login", inputs);
        setIsLoading(false);
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
        <AuthContext.Provider value={{ currentUser, login, logout, setCurrentUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    )

}