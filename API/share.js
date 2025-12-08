import toast from "react-hot-toast";
import axiosAPI from "./axsios";

export async function getSharedFiles() {
    try {
        const { data } = await axiosAPI.get("/share/shared-with-me");

        if (data.error === "Not logged!") {
            return (window.location.href = "/login");
        }

        return data.files;
    } catch (err) {
        console.log(err);
        return [];
    }
}

export async function deleteFile(id) {
    try {
        const { data } = await axiosAPI.delete(`/share/delete/${id}`);
        return { ok: true, ...data };
    } catch (err) {
        return { ok: false, error: "Failed to delete file" };
    }
}

export async function renameSharedFile(id, newName) {
    try {
        const { data } = await axiosAPI.patch(`/share/rename/${id}`, {
            newName,
        });

        return { ok: true, ...data };
    } catch (err) {
        return { ok: false, error: "Network error" };
    }
}

export async function shareDirectoryByEmail(email, directoryId, role) {
    try {
        const { data } = await axiosAPI.post(`/share/directory/${email}`, {
            directoryId,
            role,
        });

        toast.success(data.message || "Directory shared successfully");
        return data;
    } catch (err) {
        toast.error("Failed to share directory");
        console.error("Error sharing directory:", err);
        return null;
    }
}
export const getSharedDirectories = async () => {
    const res = await axiosAPI.get("/share/getallsharedDirectories");
    return res.data;
};

export async function getSharedDirectory(id) {
    try {
        const { data } = await axiosAPI.get(`/share/directories/${id}`);
        return data;
    } catch (err) {
        console.log("Error fetching shared directory", err);
        return null;
    }
}

export async function shareDirectoryWithEmails(directoryId, emails, role) {
    try {
        const { data } = await axiosAPI.post(`/share-directory`, {
            directoryId,
            emails,
            role,
        });

        return data;
    } catch (err) {
        const errorMsg = err.response?.data?.error || "Share failed";
        throw new Error(errorMsg);
    }
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
