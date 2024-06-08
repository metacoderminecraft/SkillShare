import { useContext, useState, createContext } from "react";
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (userData) => {
        try {
            const response = await axios.get(`http://localhost:1155/users/${userData.username}`);

            if (userData.password == response.data.password) {
                setUser(userData);
                return true;
            }
        } catch (error) {
            if (error.response.status != 404) {
                console.log(error);
            }

            return false;
        }
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