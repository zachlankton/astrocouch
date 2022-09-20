import db from "../../db/db";

export async function post({ request }) {
  // only allow dbName to be overridden in DEV mode
  const _dbName = import.meta.env.DEV ? request.headers.get("db_name") : null;
  const dbName = _dbName || import.meta.env.DB_NAME;

  const data = await request.json();

  const resp = await db.upsertDoc(data, { dbName });

  return new Response(JSON.stringify(resp), {
    status: 200,
  });
}
