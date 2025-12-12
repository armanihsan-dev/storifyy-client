import { useQuery } from "@tanstack/react-query";
import { fetchDirectory, fetchDirectoryChilds } from "../../API/directory";

export const useDirectory = (dirId) => {
    return useQuery({
        queryKey: ["directory", dirId],
        queryFn: () => fetchDirectory(dirId),
        retry: false,
    });
};

//returns number of files and direcotries
export const useDirectoryContent = (dirId) => {
    return useQuery({
        queryKey: ["directoryChild", dirId],
        queryFn: () => fetchDirectoryChilds(dirId),
        retry: false,
    })
}