import { useContext, useState, createContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        //Verification TODO
        setUser(userData);
        console.log(userData);
    }

    const logout = () => {
        setUser(null);
    }


    return (
        <UserContext.Provider value={{user, login, logout}}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);