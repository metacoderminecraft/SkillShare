import { useEffect } from "react";
import { useUser } from "../components/UserContext";
import { useNavigate } from "react-router-dom";

const useRedirectToLogin = () => {
    const { user } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    }, [])
}

export default useRedirectToLogin;