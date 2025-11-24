import toast from "react-hot-toast";
import axiosAPI from "./axsios";

const BASE_URL = 'http://localhost:3000';

export const getUserDirectories = async (userid) => {

    try {
        const response = await fetch(`${BASE_URL}/directory/userDirectory/${userid}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
        if (!response.ok) {
            console.error("Access denied to get user directories")
        }
        const data = await response.json();
        return data;
    } catch (err) {
        toast.error(err)
        console.log("Error fetching user directories", err);
    }
}

export const getSingleDirectory = async (dirId) => {
    try {
        const response = await fetch(`http://localhost:3000/directory/singledirectory/${dirId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Failed to fetch directory");
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.log("Error fetching single directory", error);
        return null;
    }
};


// DELETE DIRECTORY
export const deleteDirectoryAPI = async (dirId, targetuserid) => {
    try {
        const res = await fetch(`${BASE_URL}/directory/deleteUserDirectory/${dirId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ targetuserid })
        });
        if (!res.ok) {
            toast.error("Can't delete directory")
        }
        return await res.json();
    } catch (err) {
        console.log("Delete directory error", err);
    }
};

// RENAME DIRECTORY
export const renameDirectoryAPI = async (dirId, newName) => {
    try {
        const res = await fetch(`${BASE_URL}/directory/renameUserDirectory/${dirId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ name: newName }),
        });
        if (!res.ok) {
            toast.error("Can't rename directory")
        }
        const data = await res.json();
        return data
    } catch (err) {
        console.log("Rename error", err);
    }
};


export const deleteUserFile = async (id) => {
    try {
        const res = await fetch(`${BASE_URL}/file/deleteUserFile/${id}`, {
            method: 'GET',
            credentials: 'include',
        });

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.error || 'Failed to delete file');
            return;
        }
        toast.success('File deleted');


    } catch (err) {
        console.log(err);
        toast.error('Error deleting file');
    }
};
export const renameUserFile = async (fileid, newFilename) => {
    try {
        const response = await fetch(`${BASE_URL}/file/renameUserFile/${fileid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newFilename }),
            credentials: "include",
        })
        const data = await response.json();
        if (!response.ok) {
            return toast.error(data.error || 'Failed to rename file');
        }
        toast.success('File renamed');
        return data;
    } catch (err) {
        console.log("Rename file error", err);
    }
};
