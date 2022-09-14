import db from "../../../db/db";

export async function get({ params }) {
  const data = await db.getDoc(params.id);

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
