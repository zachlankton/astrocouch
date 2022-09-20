interface ImportMetaEnv {
  // CouchDB Variables
  readonly DB_SSL: string;
  readonly DB_DOMAIN: string;
  readonly DB_PORT: string;
  readonly DB_NAME: string;
  readonly DB_PASS: string;
  readonly DB_USER: string;

  // Public Variables (available on the client)
  // Need to be prefixed with PUBLIC_
  // readonly PUBLIC_POKEAPI: string;

  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
