import toast from "react-hot-toast";
import axiosAPI from "./axsios";


export const getUserDirectories = async (userid) => {
    try {
        const { data } = await axiosAPI.get(`/directory/userDirectory/${userid}`);
        return data;
    } catch (err) {
        toast.error("Error fetching user directories");
        console.log("Error fetching user directories", err);
        return null;
    }
};

export const getSingleDirectory = async (dirId) => {
    try {
        const { data } = await axiosAPI.get(`/directory/singledirectory/${dirId}`);
        return data;
    } catch (error) {
        console.log("Error fetching single directory", error);
        return null;
    }
};

export const deleteDirectoryAPI = async (dirId, targetuserid) => {
    try {
        const { data } = await axiosAPI.delete(
            `/directory/deleteUserDirectory/${dirId}`,
            { data: { targetuserid } }
        );
        return data;
    } catch (err) {
        toast.error("Can't delete directory");
        console.log("Delete directory error", err);
        return null;
    }
};

export const renameDirectoryAPI = async (dirId, newName) => {
    try {
        const { data } = await axiosAPI.put(
            `/directory/renameUserDirectory/${dirId}`,
            { name: newName }
        );

        return data;
    } catch (err) {
        toast.error("Can't rename directory");
        console.log("Rename error", err);
        return null;
    }
};

export const deleteUserFile = async (id) => {
    try {
        const { data } = await axiosAPI.get(`/file/deleteUserFile/${id}`);

        if (data.error) {
            toast.error(data.error);
            return;
        }

        toast.success("File deleted");
        return data;
    } catch (err) {
        console.log(err);
        toast.error("Error deleting file");
        return null;
    }
};

export const renameUserFile = async (fileid, newFilename) => {
    try {
        const { data } = await axiosAPI.post(
            `/file/renameUserFile/${fileid}`,
            { newFilename }
        );

        if (data.error) {
            toast.error(data.error);
            return null;
        }

        toast.success("File renamed");
        return data;

    } catch (err) {
        console.log("Rename file error", err);
        toast.error("Failed to rename file");
        return null;
    }
};
