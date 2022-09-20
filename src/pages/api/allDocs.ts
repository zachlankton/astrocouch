import db from "../../db/db";

export async function get({ request }) {
  const dbName = request.headers.get("db_name") || import.meta.env.DB_NAME;

  const data = await db.allDocs({ dbName });

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
