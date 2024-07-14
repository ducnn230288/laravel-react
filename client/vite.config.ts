import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { loadEnv, type ConfigEnv, type UserConfig } from 'vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const { VITE_PORT } = loadEnv(mode, root);

  const isBuild = command === 'build';
  return {
    server: {
      host: true,
      open: true,
      port: Number(VITE_PORT),
      watch: {
        usePolling: true,
      },
    },
    plugins: [
      react(),
      tsconfigPaths(),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/svg')],
        svgoOptions: isBuild,
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
    build: {
      target: 'es2015',
      cssTarget: 'chrome86',
      minify: 'terser',
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: isBuild,
        },
      },
      chunkSizeWarningLimit: 600,
      outDir: './build',
    },
    resolve: {
      alias: [{ find: /^~/, replacement: '' }],
    },
  };
};
