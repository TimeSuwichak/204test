import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig (
{
    base: "/UniversityCSI204",
    envDir: "./../",
    envPrefix: ["F_"],
    plugins: 
    [
        react (),
        tailwind ()
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
            preflightContinue: true,
            origin: /^https?:\/\/(?:(?:[^:]+\.)?localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/ 
        },
        watch:
        {
            ignored: ["**/src/doc/**"]
        }
    },
});