import toast from "react-hot-toast";

const BASE_URL = 'http://localhost:3000';

export const loginWithGoogle = async (id_token) => {
    const response = await fetch(`${BASE_URL}/auth/google`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_token }),
        credentials: 'include'
    })
    if (!response.ok) {
        toast.error('Failed to login with Google');
    }
    const data = await response.json()
    return data
}