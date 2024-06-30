import { loadEnv, type ConfigEnv, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tsconfigPaths from 'vite-tsconfig-paths';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_PORT } = viteEnv;

  const isBuild = command === 'build';
  return {
    server: {
      host: true,
      open: true,
      port: VITE_PORT,
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

declare type Recordable<T = any> = Record<string, T>;

interface ViteEnv {
  VITE_PORT: number;
  VITE_PROXY: [string, string][];
  VITE_DROP_CONSOLE: boolean;
}

// read all environment variable configuration files to process.env
export function wrapperEnv(envConf: Recordable): ViteEnv {
  const result: any = {};

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n');
    realName = realName === 'true' ? true : realName === 'false' ? false : realName;

    if (envName === 'VITE_PORT') {
      realName = Number(realName);
    }

    if (envName === 'VITE_PROXY' && realName) {
      try {
        realName = JSON.parse(realName.replace(/'/g, '"'));
      } catch (error) {
        realName = '';
      }
    }

    result[envName] = realName;

    if (typeof realName === 'string') {
      process.env[envName] = realName;
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName);
    }
  }

  return result;
}
