import { defineConfig } from 'vitepress';

//
// Reference link:
// - https://vitepress.dev/reference/site-config
// - https://vitepress.dev/reference/default-theme-config
//
export default defineConfig (
{
    base: "/UniversityCSI204/doc", 
    title: "ร้านขายแผ่นและตลับเกม",
    outDir: "../../build/doc",
    themeConfig: {
        // 
        // nav: [
        //   { text: 'Home', link: '/' },
        //   { text: 'Examples', link: '/markdown-examples' }
        // ],

        sidebar: {
        '/dev':
        [{
            items: 
            [{ text: 'หน้าแรก', link: '/dev-home' },
            { text: 'เงื่อนไขการใช้งาน', link: '/dev-license' },
            { text: 'วิธีการติดตั้ง', link: '/dev-setup' },
            { 
                text: "API", 
                items: 
                [{ text: "ยืนยันตัวตน", link: "/dev-api-auth" },
                { text: "บัญชี", link: "/dev-api-account" }]
            }],
        }]},

        socialLinks: 
        [
            { 
                icon: 'github', 
                link: 'https://github.com/iKla47/UniversityCSI204' 
            }
        ]
    }
});
