import { createClient } from "@/lib/supabase/server";
import { DocumentCard } from "@/components/dashboard/DocumentCard";
import { CreateDocumentButton } from "@/components/dashboard/CreateDocumentButton";
import { signOut } from "@/app/(protected)/dashboard/actions";
import { FileText, Hexagon, LogOut } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch documents
  const { data: documents, error } = await supabase
    .from("documents")
    .select("id, title, updated_at, content")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching documents:", error);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Dashboard Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Hexagon className="w-5 h-5 text-white fill-white/20" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Scribe</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              {user.email}
            </span>
            <form action={signOut}>
              <button className="p-2 text-muted-foreground hover:text-white transition-colors rounded-lg hover:bg-white/5">
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-serif mb-1 sm:mb-2">Your Documents</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Create, edit, and manage your AI-assisted knowledge bases.</p>
          </div>
          <CreateDocumentButton />
        </div>

        {(!documents || documents.length === 0) ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center text-center p-8 sm:p-16 rounded-2xl sm:rounded-3xl border border-dashed border-border bg-card/30">
            <div className="h-14 w-14 sm:h-16 sm:w-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-5 sm:mb-6">
              <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-serif mb-2 sm:mb-3">No documents yet</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md mb-6 sm:mb-8">
              You haven&apos;t created any documents. Start writing your first AI-assisted SOP, tutorial, or manual today.
            </p>
            <CreateDocumentButton />
          </div>
        ) : (
          /* Document Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {documents.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}