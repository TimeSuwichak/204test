import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig (
{
    base: "/UniversityCSI204", 
    plugins: 
    [
        react (),
    ],
    resolve:
    {
        tsconfigPaths: true,
    },
    build:
    {
        outDir: "build",
        ssr: false,
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
        },
        watch:
        {
            ignored: ["src/doc/**"]
        }
    },
});