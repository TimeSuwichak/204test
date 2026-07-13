
const content = function ()
{
    return;
}
content.BASE_PROTOCOL = "http";
content.BASE_HOST = `${location.hostname}:51000`;
content.BASE_URL = `${content.BASE_PROTOCOL}://${content.BASE_HOST}`;

content.AUTH_HOST = content.BASE_URL;
content.AUTH_PREFIX = "/auth";
content.AUTH_URL = `${content.AUTH_HOST}${content.AUTH_PREFIX}`;

content.getJson = function (endpoint: string, path: string, body ?: Record<string, unknown>)
{
    return fetch (`${endpoint}${path}`, {
        method: "GET",
        mode: "cors",
        referrerPolicy: "strict-origin",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: body ? JSON.stringify (body) : undefined
    });
}
content.postJson = function (endpoint: string, path: string, body ?: Record<string, unknown>)
{
    return fetch (`${endpoint}${path}`, {
        method: "POST",
        mode: "cors",
        referrerPolicy: "strict-origin",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: body ? JSON.stringify (body) : undefined
    });
}

export default content;