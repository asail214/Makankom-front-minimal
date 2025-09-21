/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_SERVER_URL: string;
  
    // Add any public keys you plan to use (optional ones can be string | undefined)
    readonly VITE_THAWANI_PUBLIC_KEY?: string;
    readonly VITE_AMWALPAY_PUBLIC_KEY?: string;
  
    // Add more as you need them, e.g. maps, analytics, etc.
    // readonly VITE_MAPBOX_TOKEN?: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  