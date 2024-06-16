import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 4000,
        watch: {
            usePolling: true,
        },
    },
    plugins: [
        react(),
        tsconfigPaths(),
        svgr({
            include: '**/*.svg',
            exclude: '',
        }),
    ],
    build: {
        chunkSizeWarningLimit: 600,
        outDir: './build',
    },
    resolve: {
        alias: [{ find: /^~/, replacement: '' }],
    },
});
//# sourceMappingURL=vite.config.js.map