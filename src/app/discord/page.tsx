import { redirect } from "next/navigation";

const DISCORD_INVITE = "https://discord.gg/SBx3mn4r8e";

export default function DiscordPage() {
  redirect(DISCORD_INVITE);
}
