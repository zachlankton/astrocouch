import db from "../../db/db";

export async function get() {
  const data = await db.allDocs();

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
