import db from "../../db/db";

export async function post({ request }) {
  const data = await request.json();

  const resp = await db.upsertDoc(data);

  return new Response(JSON.stringify(resp), {
    status: 200,
  });
}
