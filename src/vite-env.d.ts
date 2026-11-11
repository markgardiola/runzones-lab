/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PAYPAL_DONATION_URL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
