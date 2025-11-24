import toast from "react-hot-toast";

const BASE_URL = 'http://localhost:3000';
export async function logoutFromAllAccounts(BASEURL) {

    try {
        const response = await fetch(`${BASEURL}/user/logoutfromAllAccounts`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Logout from all accounts failed');
        }
        const data = await response.json();
        toast.success(data.message);
    } catch (err) {
        console.log(err);
    }
}

export async function getCurrectUser(BASEURL) {
    try {
        const response = await fetch(`${BASEURL}/user`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            return { status: 401 }
        }
        const data = await response.json();
        return data
    } catch (error) {
        console.log('Cannot get current user', error);
    }
}
export async function getAllUsers(BASEURL) {

    try {


        const response = await fetch(`${BASEURL}/user/users`, {
            method: 'GET',
            credentials: 'include',
        });
        if (!response.ok) {
            throw new Error('Logout from all accounts failed');
        }
        const data = await response.json();
        return data
    } catch (err) {
        console.log(err);
    }
}

export async function logoutUser(BASEURL, userid) {
    const response = await fetch(`${BASEURL}/user/logoutuser/${userid}`, {
        method: 'POST',
        credentials: 'include',
    });
    if (!response.ok) {
        toast.error("Can't delete role!")
    }
    const data = await response.json();
    return data;
}



export async function deleteUser(BASEURL, userid) {
    const response = await fetch(`${BASEURL}/user/softdeleteuser/${userid}`, {
        method: 'DELETE',
        credentials: 'include',
    })
    if (!response.ok) {
        toast.error("Can't delete user!")
    }
    const data = await response.json()
    console.log(data);
    return data;
}

export async function hardDeleteUser(BASEURL, userid) {
    const response = await fetch(`${BASEURL}/user/harddeleteuser/${userid}`, {
        method: 'DELETE',
        credentials: 'include',
    })
    if (!response.ok) {
        toast.error("Can't delete user!")
    }
    const data = await response.json()
    console.log(data);
    return data;
}

export async function recoverUser(BASEURL, userid) {
    const response = await fetch(`${BASEURL}/user/recoveruser/${userid}`, {
        method: 'POST',
        credentials: 'include',
    })
    if (!response.ok) {
        toast.error("Can't recover user!")
    }
    const data = await response.json()
    console.log(data);
    return data;
}

export async function changeRole(BASEURL, userid, role) {
    const response = await fetch(`${BASEURL}/user/changerole`, {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newRole: role, userId: userid })
    })
    if (!response.ok) {
        toast.error("Can't change role!")
    }
    const data = await response.json()
    console.log(data);
    return data;
}

export async function getUserInfo(userid) {
    try {
        const response = await fetch(`${BASE_URL}/user/getUserInfo/${userid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        if (!response.ok) {
            throw new Error("Failed to fetch user info");
        }
        const data = await response.json();
        return data;
    } catch (err) {
        console.log("Error fetching user info", err);
    }
}