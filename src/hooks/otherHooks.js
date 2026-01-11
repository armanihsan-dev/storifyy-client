import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getCurrectUser } from "../../API/userAPI";
import axiosAPI from "../../API/axsios";
import { fetchMySubscription, generateInvoice } from "../../API/lemonSqueezy";
import toast from "react-hot-toast";

const formatUser = (data) => {
    const formattedDate = new Date(data.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    const formattedUpdate = new Date(data.updatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    const ageDays = Math.ceil(
        (Date.now() - new Date(data.createdAt)) / (1000 * 60 * 60 * 24)
    );
    return {
        ...data,
        formattedDate,
        formattedUpdate,
        accountAge: `${ageDays} days`,
    };
}

export const useCurrentUser = () => {
    return useQuery({
        queryKey: ["current-user"],
        queryFn: async () => {
            const data = await getCurrectUser();

            if (data?.status === 401) {
                throw new Error("Unauthorized");
            }

            return formatUser(data); // optional formatter
        },
        retry: false,
    });
};

export const useBreadcrumb = (dirId) => {
    return useQuery({
        queryKey: ["breadcrumb", dirId],
        queryFn: async () => {
            const { data } = await axiosAPI.get(`/directory/breadcrumb/${dirId}`);
            return data;
        },
        enabled: typeof dirId === "string" && dirId.trim().length > 0
    });
};


export const useToggleStar = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (dirId) => {
            const { data } = await axiosAPI.patch(`/directory/star/${dirId}`);
            return data;
        },

        onSuccess: (_, dirId) => {
            queryClient.invalidateQueries(["directoryList"]);
            queryClient.invalidateQueries(["breadcrumb", dirId]);
        }
    });
};

export const useStarred = () =>
    useQuery({
        queryKey: ["starred"],
        queryFn: async () => {
            const { data } = await axiosAPI.get("/directory/starred", { withCredentials: true });
            return data;
        },
    });


export const useMySubscription = () => {
    return useQuery({
        queryKey: ['my-current-subscription'],
        queryFn: fetchMySubscription,
        staleTime: 1000 * 60, // 1 min
    });
};


export const useGenerateInvoice = () => {
    return useMutation({
        mutationFn: generateInvoice,
        onSuccess: (url) => {
            console.log(url);
            window.open(url, '_blank');
            toast.success('Invoice generated');
        },
        onError: () => {
            toast.error('Failed to generate invoice');
        },
    });
};



export function useSearch(query, parendDirId) {
    return useQuery({
        queryKey: ["search", query],
        enabled: typeof query === "string" && query.trim().length > 0,
        queryFn: async () => {
            const { data } = await axiosAPI.get("/search", {
                params: { q: query, parendDirId },
                withCredentials: true,
            });

            return data;
        },
        staleTime: 30_000,
    });
}

export function useAccountDisable() {
    return useMutation({
        mutationFn: async () => {
            const { data } = await axiosAPI.post(
                '/account/disable',
                {},
                { withCredentials: true }
            );
            return data;
        }
    });
}

export function useDeleteAccount() {
    return useMutation({
        mutationFn: async () => {
            const { data } = await axiosAPI.post('/account/delete',
                {},
                { withCredentials: true }
            )
            return data;
        }
    })
}