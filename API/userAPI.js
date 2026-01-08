import axiosAPI from "./axsios";
import toast from "react-hot-toast";

// LOGOUT FROM ALL ACCOUNTS
export async function logoutFromAllAccounts() {
    try {
        const { data } = await axiosAPI.post(`/user/logoutfromAllAccounts`);
        toast.success(data.message);
    } catch (err) {
        console.log(err);
    }
}

// GET CURRENT USER
export async function getCurrectUser() {
    try {
        const { data } = await axiosAPI.get(`/user`);
        return data;
    } catch (error) {
        return { status: 401 };
    }
}

// GET ALL USERS
export async function getAllUsers() {
    try {
        const { data } = await axiosAPI.get(`/user/users`);
        return data;
    } catch (err) {
        console.log(err);
    }
}

// LOGOUT SPECIFIC USER
export async function logoutUser(userid) {
    try {
        const { data } = await axiosAPI.post(`/user/logoutuser/${userid}`);
        return data;
    } catch (err) {
        toast.error("Can't delete role!");
        return null;
    }
}

// SOFT DELETE USER
export async function deleteUser(userid) {
    try {
        const { data } = await axiosAPI.delete(`/user/softdeleteuser/${userid}`);
        console.log(data);
        return data;
    } catch (err) {
        toast.error("Can't delete user!");
        return null;
    }
}

// HARD DELETE USER
export async function hardDeleteUser(userid) {
    try {
        const { data } = await axiosAPI.delete(`/user/harddeleteuser/${userid}`);
        console.log(data);
        return data;
    } catch (err) {
        toast.error("Can't delete user!");
        return null;
    }
}

// RECOVER USER
export async function recoverUser(userid) {
    try {
        const { data } = await axiosAPI.post(`/user/recoveruser/${userid}`);
        console.log(data);
        return data;
    } catch (err) {
        toast.error("Can't recover user!");
        return null;
    }
}

// CHANGE ROLE
export async function changeRole(userid, role) {
    try {
        const { data } = await axiosAPI.post(`/user/changerole`, {
            newRole: role,
            userId: userid,
        });
        console.log(data);
        return data;
    } catch (err) {
        toast.error("Can't change role!");
        return null;
    }
}

// GET USER INFO
export async function getUserInfo(userid) {
    try {
        const { data } = await axiosAPI.get(`/user/getUserInfo/${userid}`);
        return data;
    } catch (err) {
        console.log("Error fetching user info", err);
    }
}

export const fetchShareableUsers = async ({ queryKey }) => {
    const [, search] = queryKey

    const res = await axiosAPI.get('/user/shareable', {
        params: {
            q: search || '',
            limit: 10,
        },
    })

    return res.data.users
}

