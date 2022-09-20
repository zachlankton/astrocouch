import CouchDB from "../lib/CouchDB";

// get defaults from environment
const scheme = import.meta.env.DB_SSL === "true" ? "https" : "http";
const domain = import.meta.env.DB_DOMAIN;
const port = import.meta.env.DB_PORT;
const dbName = import.meta.env.DB_NAME;
const user = import.meta.env.DB_USER;
const pass = import.meta.env.DB_PASS;
const logLevelEnv: string = import.meta.env.LOGLEVEL?.toUpperCase() || "DEBUG";

const db = new CouchDB({
  scheme,
  domain,
  port,
  dbName,
  user,
  pass,
  logLevelEnv,
});

export default db;
