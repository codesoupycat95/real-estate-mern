import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        proxy: {
            "/api": {                      // You can even use single-quotes in place of double quotes
                target: "http://localhost:3000",
                secure: false,
            },
        },
    },
    plugins: [react()],
})
