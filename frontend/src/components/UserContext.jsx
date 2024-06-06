import { useContext, useState, createContext } from "react";
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (userData) => {
        return axios
                .get(`http://localhost:1155/users/${userData.username}`)
                .then((response) => {
                    if (userData.password == response.data.password) {
                        setUser(userData);
                        return true;
                    }
                    
                    return false;
                })
                .catch((error) => {
                    if (error.response && error.response.status == 404) {
                        return false;
                    } else {
                        console.log(error);
                    }
                })

                return false;
    }

    const logout = () => {
        setUser(null);
    }


    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);