import { getClients } from "@/actions/getClients";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const search = searchParams.get("search") || "";

  const clients = await getClients(search);

  return NextResponse.json(clients);
}