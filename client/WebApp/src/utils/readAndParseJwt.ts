export default function readAndParseJwt<T>(jwt: string): T | null {
    if (!jwt || typeof jwt !== "string") {
        console.error("Invalid JWT provided.");
        return null;
    }
    if (jwt.split(".").length !== 3) {
        console.error("Invalid JWT format.");
        return null;
    }
    // Decode the JWT payload
    // This function decodes the JWT payload and returns it as an object of type T
    const parts = jwt.split(".");
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    try {
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
                .join(""),
        );
        return JSON.parse(jsonPayload) as T;
    } catch (error) {
        console.error("Failed to parse JWT:", error);
    }

    return null;
}
