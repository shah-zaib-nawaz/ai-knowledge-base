"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createConversation } from "@/lib/chat-store";

export async function startNewChat() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const id = await createConversation(session.user.id);
  redirect(`/chat/${id}`);
}
