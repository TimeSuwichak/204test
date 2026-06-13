import react from "@vitejs/plugin-react";

export default
{
    plugins: 
    [
        react (),
    ],
    resolve:
    {
        tsconfigPaths: true,
    },
    server: 
    {
        host: "0.0.0.0",
        port: 50000,
        strictPort: true,
        hmr: true,
        cors:
        {
            methods: "GET",
            credentials: true,
            origin: /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/ 
        }
    },
}