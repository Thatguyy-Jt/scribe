import Link from "next/link";
import { ArrowLeft, CheckCircle2, CircleDashed, Loader2, Library, Sparkles } from "lucide-react";
import { SaveStatus } from "@/hooks/useDocument";

interface DocumentHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  saveStatus: SaveStatus;
  hasPendingChanges: boolean;
  onToggleLeftSidebar?: () => void;
  onToggleRightSidebar?: () => void;
  leftSidebarOpen?: boolean;
  rightSidebarOpen?: boolean;
}

export function DocumentHeader({ 
  title, 
  onTitleChange, 
  saveStatus, 
  hasPendingChanges,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  leftSidebarOpen,
  rightSidebarOpen
}: DocumentHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-6 overflow-hidden">
      <div className="flex items-center gap-2 md:gap-4 min-w-0">
        <Link 
          href="/dashboard" 
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          title="Back to Dashboard"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        {onToggleLeftSidebar && (
          <button
            onClick={onToggleLeftSidebar}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors lg:hidden ${leftSidebarOpen ? 'bg-blue-500/10 text-blue-500' : 'text-muted-foreground hover:bg-card hover:text-foreground'}`}
            title="Toggle Knowledge Sidebar"
          >
            <Library className="h-4 w-4" />
          </button>
        )}
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="bg-transparent text-base md:text-lg font-bold font-serif outline-none placeholder:text-muted-foreground/50 w-32 sm:w-48 md:w-64 lg:w-96 focus:ring-2 focus:ring-blue-500/20 rounded px-2 md:-ml-2 transition-all truncate"
          placeholder="Untitled Document"
        />
      </div>

      <div className="flex items-center gap-2 md:gap-4 shrink-0">
        <div className="flex items-center text-sm">
          {saveStatus === "saving" || hasPendingChanges ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="hidden sm:inline">Saving...</span>
            </div>
          ) : saveStatus === "saved" ? (
            <div className="flex items-center gap-2 text-blue-500">
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline">Saved</span>
            </div>
          ) : saveStatus === "error" ? (
            <div className="flex items-center gap-2 text-red-500">
              <CircleDashed className="h-4 w-4" />
              <span className="hidden sm:inline">Failed to save</span>
            </div>
          ) : null}
        </div>
        {onToggleRightSidebar && (
          <button
            onClick={onToggleRightSidebar}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors xl:hidden ${rightSidebarOpen ? 'bg-amber-500/10 text-amber-500' : 'text-muted-foreground hover:bg-card hover:text-foreground'}`}
            title="Toggle AI Chat Sidebar"
          >
            <Sparkles className="h-4 w-4" />
          </button>
        )}
      </div>
    </header>
  );
}