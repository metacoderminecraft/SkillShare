import { useEffect } from "react";
import { useUser } from "../components/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useRedirectToLogin = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            return;
        }

        axios.get("http://localhost:1155/users/checkAuth", { withCredentials: true })
        .then(response => {
            if (!response.data.authenticated) {
                navigate("/");
            }

            setUser(response.data.user);
        })
    }, [user])
}

export default useRedirectToLogin;