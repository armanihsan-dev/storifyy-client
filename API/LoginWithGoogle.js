import toast from "react-hot-toast";
import axiosAPI from "./axsios";


export const loginWithGoogle = async (id_token) => {
    try {
        const { data } = await axiosAPI.post("/auth/google", {
            id_token,
        });
        return data;
    } catch (error) {
        toast.error("Failed to login with Google");
        return null;
    }
}