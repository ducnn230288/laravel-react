/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_URL_SOCKET: string;
  readonly VITE_URL_API: string;
  readonly VITE_URL_LANGUAGES: string;
  readonly VITE_URL_LANGUAGE: string;
  readonly VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare const GLightbox: GLightbox;
declare const echarts: echarts;
declare const Swal: any;
declare const SUNEDITOR: any;
declare const PerfectScrollbar: any;
