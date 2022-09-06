const scheme = import.meta.env.DB_SSL === "true" ? "https" : "http";
const dbDomain = import.meta.env.DB_DOMAIN;
const dbPort = import.meta.env.DB_PORT ? ":" + import.meta.env.DB_PORT : "";
const dbName = import.meta.env.DB_NAME;
const dbPass = import.meta.env.DB_PASS;
const dbUser = import.meta.env.DB_USER;
const db = `${scheme}://${dbDomain}${dbPort}/${dbName}`;

async function getDbInfo() {
  console.log(db, btoa(dbUser + ":" + dbPass));
  const resp = await fetch(db, {
    headers: new Headers({
      Authorization: `Basic ${btoa(dbUser + ":" + dbPass)}`,
    }),
  });
  const data = await resp.json();
  return data;
}

export { getDbInfo };
