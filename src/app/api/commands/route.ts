import { commands } from "@/app/commands/commands";

export async function GET() {
  return Response.json(commands);
}
