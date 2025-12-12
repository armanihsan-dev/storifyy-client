export function formatFileSize(bytes) {
    if (!bytes || isNaN(bytes)) return "0 B";

    const units = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    const value = bytes / Math.pow(1024, i);

    return `${value.toFixed(2)} ${units[i]}`;
}


export function shortenRoot(name) {
    if (!name.startsWith("root-")) return name;

    const email = name.replace("root-", "");
    const short = email.length > 10 ? email.substring(0, 10) + "..." : email;

    return `root-${short}`;
}
