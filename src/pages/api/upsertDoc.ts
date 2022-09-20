import db from "../../db/db";

export async function post({ request }) {
  const dbName = request.headers.get("db_name") || import.meta.env.DB_NAME;

  const data = await request.json();

  const resp = await db.upsertDoc(data, { dbName });

  return new Response(JSON.stringify(resp), {
    status: 200,
  });
}
