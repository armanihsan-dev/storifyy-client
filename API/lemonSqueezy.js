
import axiosAPI from "./axsios";

export async function createSubscriptionCheckout(variantId) {
    const res = await axiosAPI.post('/lsqueezy/create-subscription-checkout', {
        variantId,
    });

    return res.data.url;
}

export async function cancelSubscription() {
    const res = await axiosAPI.post('/lsqueezy/cancel-subscription');
    return res.data;
}

//resume 
export async function resumeSubscription() {
    const res = await axiosAPI.post('/lsqueezy/resume-subscription');
    return res.data;
}
export const fetchMySubscription = async () => {
    const { data } = await axiosAPI.get('/lsqueezy/my-subscription');
    return data;
};

export async function pauseSubscription() {
    const res = await axiosAPI.post('/lsqueezy/pause-subscription');
    return res.data;
}


export async function unpauseSubscription() {
    const res = await axiosAPI.post('/lsqueezy/unpause-subscription');
    return res.data;
}

export const generateInvoice = async (payload) => {
    const { data } = await axiosAPI.post(
        `/lsqueezy/subscriptions/invoice`,
        payload,
        { withCredentials: true }
    );

    return data.invoiceUrl;
};