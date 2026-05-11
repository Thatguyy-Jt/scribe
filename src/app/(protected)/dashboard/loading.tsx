import { Hexagon, LogOut } from "lucide-react";
import Link from "next/link";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Dashboard Header Skeleton */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-card animate-pulse" />
            <div className="h-6 w-20 bg-card rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-32 bg-card rounded animate-pulse hidden sm:block" />
            <div className="h-8 w-8 bg-card rounded animate-pulse" />
          </div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-1 max-w-7xl mx-auto px-6 lg:px-8 py-12 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="space-y-3">
            <div className="h-8 w-48 bg-card rounded animate-pulse" />
            <div className="h-4 w-72 bg-card rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-card rounded-full animate-pulse" />
        </div>

        {/* Document Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col h-48 p-5 rounded-2xl border border-border bg-card/50 animate-pulse">
              <div className="h-6 w-3/4 bg-border/50 rounded mb-2" />
              <div className="h-3 w-1/2 bg-border/30 rounded mb-auto" />
              <div className="space-y-2 mt-4">
                <div className="h-3 w-full bg-border/30 rounded" />
                <div className="h-3 w-5/6 bg-border/30 rounded" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}