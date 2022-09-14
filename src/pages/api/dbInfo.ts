import db from "../../db/db";

export async function get() {
  const data = await db.getDbInfo();

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
