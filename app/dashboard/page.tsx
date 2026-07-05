import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutButton } from "./sign-out-button";
import { UploadForm } from "./upload-form";
import { DocumentList } from "./document-list";
import { startNewChat } from "@/app/actions/chat";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  return (
    <div className="max-w-2xl mx-auto py-16 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Knowledge Base</h1>
        <SignOutButton />
      </div>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Upload a document</h2>
        <UploadForm />
      </section>
      <form action={startNewChat}>
  <button className="px-4 py-2 bg-black text-white rounded">
    New Chat
  </button>
</form>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Your documents</h2>
        <DocumentList userId={session.user.id} />
      </section>
    </div>
  );
}
