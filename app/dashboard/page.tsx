import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { SignOutButton } from "./sign-out-button";
import { UploadForm } from "./upload-form";
import { DocumentList } from "./document-list";
import { startNewChat } from "@/app/actions/chat";
import { getUsageSummary } from "@/lib/usage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle } from "lucide-react"; // Or any icon library you use

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in");

  const usageSummary = await getUsageSummary(session.user.id, 30);

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-10">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-5">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Knowledge Base</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your context documents and chat interactions.</p>
        </div>
        <SignOutButton />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column: Upload & Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upload a document</CardTitle>
              <CardDescription>Supported formats: TXT, MD, PDF</CardDescription>
            </CardHeader>
            <CardContent>
              <UploadForm />
            </CardContent>
          </Card>

          <form action={startNewChat}>
            <Button size="lg" className="w-full flex items-center justify-center gap-2 shadow-sm">
              <PlusCircle className="h-5 w-5" />
              Start New Chat
            </Button>
          </form>
        </div>

        {/* Right Column: Usage Metrics */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-lg">Your Usage</CardTitle>
              <CardDescription>Rolling summary for the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4 pt-2">
              <div className="rounded-xl bg-muted/50 p-4 border">
                <div className="text-2xl font-bold tracking-tight">{usageSummary.totalRequests}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Requests</div>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 border">
                <div className="text-2xl font-bold tracking-tight">
                  {usageSummary.totalTokens.toLocaleString()}
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mt-1">Tokens</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Section: Document List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Documents</CardTitle>
          <CardDescription>All knowledge sources synced to your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentList userId={session.user.id} />
        </CardContent>
      </Card>
    </div>
  );
}