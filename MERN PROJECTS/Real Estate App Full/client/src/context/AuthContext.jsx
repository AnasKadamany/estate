import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({children})=>{

    const getUserData = () => {
        const storedUserData = localStorage.getItem("userData");
        try {
            return storedUserData ? JSON.parse(storedUserData) : null;
        } catch (error) {
            console.error("Error parsing userData from localStorage", error);
            return null;
        }
    };
    
    const [currentUser, setCurrentUser] = useState(getUserData());

    const updateUser=(data)=>{
        setCurrentUser(data);
    }

    useEffect(()=>{
        localStorage.setItem("userData",JSON.stringify(currentUser))
    },[currentUser])

    return <AuthContext.Provider value={{currentUser,updateUser}}>{children}</AuthContext.Provider>
}