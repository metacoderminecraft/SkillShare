import { useContext, useState, createContext } from "react";
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = async (userData) => {
        try {
            const response = await axios.post(`http://localhost:1155/users/login`, { username: userData.username, password: userData.password }, { withCredentials: true });
            setUser(response.data.user);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }
  
    const logout = async () => {
        try {
            await axios.post(`http://localhost:1155/users/logout`, {}, { withCredentials: true });
            setUser(null);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <UserContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext);