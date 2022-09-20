import db from "../../../db/db";

export async function get({ params, request }) {
  const dbName = request.headers.get("db_name") || import.meta.env.DB_NAME;

  const data = await db.getDoc(params.id, { dbName });

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
