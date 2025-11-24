import toast from "react-hot-toast";
import { BASE_URL } from "../utility/Server";
import axiosAPI from "./axsios";

export async function getSharedFiles() {
    const res = await fetch("http://localhost:3000/share/shared-with-me", {
        method: "GET",
        credentials: "include"
    });
    const data = await res.json();
    if (data.error === 'Not logged!') {
        return window.location.href = '/login'
    }
    return data.files;
}

export async function deleteFile(id) {
    const res = await fetch(`${BASE_URL}/share/delete/${id}`, {
        method: "DELETE",
        credentials: "include",
    });

    const data = await res.json();
    return { ok: res.ok, ...data };
}

export async function renameSharedFile(id, newName) {
    try {
        const response = await fetch(`${BASE_URL}/share/rename/${id}`, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newName }),
        });

        const data = await response.json();

        return { ok: response.ok, ...data };
    } catch (err) {
        return { ok: false, error: "Network error" };
    }
}


export async function shareDirectoryByEmail(email, directoryId, role) {
    try {
        const response = await fetch(`${BASE_URL}/share/directory/${email}`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ directoryId, role }),
        })
        if (!response.ok) {
            toast.error("Failed to shared directory")
            return
        }
        const data = await response.json();
        toast.success(data.message || 'Directory shared successfully')
        return data

    } catch (err) {
        console.error("Error sharing directory:", err);
    }
}

export const getSharedDirectories = async () => {
    const res = await axiosAPI.get("/share/getallsharedDirectories");
    return res.data;
};
export async function getSharedDirectory(id) {
    const res = await fetch(`${BASE_URL}/share/directories/${id}`, {
        method: "GET",
        credentials: "include",
    });

    const data = await res.json();
    return data;
}

export async function shareDirectoryWithEmails(directoryId, emails, role) {
    const res = await fetch(`${BASE_URL}/share-directory`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ directoryId, emails, role })
    });

    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Share failed");
    }

    return res.json();
}


export async function deletesharedirectory(dirid) {
    const res = await axiosAPI.delete(`/share/deltesharedirectry/${dirid}`)
    return res.data
}

export async function renameSharedDirectory(dirid, newName) {
    const res = await axiosAPI.patch(`/share/renamedirectory/${dirid}`, { newName })
    return res.data
}
// this will return all the directories the requesting use has been shared with others
export async function getAllSharedDirectories() {
    const res = await axiosAPI.get('/share/getDirectoriesSharedByMe')
    return res.data
}

export async function revokeSharedDirectory(dirId, email) {
    const res = await axiosAPI.delete('/share/revokeSharedDirectory', {
        data: { dirId, email },
    });
    return res.data;
}
