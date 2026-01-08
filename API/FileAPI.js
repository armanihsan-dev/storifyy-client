import axiosAPI from "./axsios";

export const uploadInitiate = async (fileData) => {
    console.log(fileData);
    const { data } = await axiosAPI.post('/file/upload/initiate', fileData)
    return data
}

export const uploadComplete = async (fileID) => {
    const { data } = await axiosAPI.post('/file/upload/complete', { fileID })
    return data
}