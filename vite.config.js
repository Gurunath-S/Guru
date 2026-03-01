import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'build', // keeps compatibility with the previous CRA output folder for deployment pipelines
    },
    server: {
        port: 3000,
    }
});
