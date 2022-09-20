import db from "../../db/db";

export async function get({ request }) {
  // only allow dbName to be overridden in DEV mode
  const _dbName = import.meta.env.DEV ? request.headers.get("db_name") : null;
  const dbName = _dbName || import.meta.env.DB_NAME;

  const data = await db.getCouchDbInfo({ dbName });

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
