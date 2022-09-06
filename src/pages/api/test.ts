import { getDbInfo } from "../../lib/db";

export async function get() {
  const data = await getDbInfo();

  return new Response(JSON.stringify(data), {
    status: 200,
  });
}
