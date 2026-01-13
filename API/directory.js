const BASE_URL = "https://storifyy-backend.onrender.com";
export const fetchDirectory = async (dirId) => {

    const response = await fetch(
        `${BASE_URL}/directory${dirId ? `/${dirId}` : ""}`,
        { credentials: "include" }
    );

    const data = await response.json();

    if (!response.ok) {
        const message = data.error || "Failed to load directory";
        throw new Error(message);
    }

    return data;
};

export const fetchDirectoryChilds = async (dirId) => {
    const response = await fetch(
        `${BASE_URL}/directory/dirChilds${dirId ? `/${dirId}` : ""}`,
        { credentials: "include" }
    );

    const data = await response.json();
    if (!response.ok) {
        const message = data.error || "Failed to load directory";
        throw new Error(message);
    }

    return data;
};
