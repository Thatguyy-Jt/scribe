"use client";

import { DocumentEditor } from "./DocumentEditor";
import { KnowledgeSidebar } from "./KnowledgeSidebar";
import { AIChatSidebar } from "./AIChatSidebar";
import { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";

export function DocumentWorkspace({ documentId }: { documentId: string }) {
  const [editor, setEditor] = useState<Editor | null>(null);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  useEffect(() => {
    // Open sidebars by default on larger screens
    const handleResize = () => {
      if (window.innerWidth >= 1024) setLeftSidebarOpen(true);
      if (window.innerWidth >= 1280) setRightSidebarOpen(true);
    };
    
    handleResize(); // Check on initial load
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background text-foreground relative">
      {/* Left Sidebar (Knowledge) */}
      <div 
        className={`absolute inset-y-0 left-0 z-20 w-[85vw] max-w-72 flex-col border-r border-border bg-background shadow-xl lg:shadow-none lg:static lg:w-72 lg:max-w-none lg:bg-card/30 transition-transform duration-300 ease-in-out flex ${
          leftSidebarOpen ? "translate-x-0" : "-translate-x-full lg:hidden"
        }`}
      >
        <KnowledgeSidebar documentId={documentId} />
      </div>

      {/* Overlay for mobile sidebars */}
      {(leftSidebarOpen || rightSidebarOpen) && (
        <div 
          className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => {
            setLeftSidebarOpen(false);
            setRightSidebarOpen(false);
          }}
        />
      )}

      {/* Center - Editor Core */}
      <div className="flex-1 flex flex-col min-w-0 transition-all z-0">
        <DocumentEditor 
          documentId={documentId} 
          onEditorReady={setEditor} 
          onToggleLeftSidebar={() => setLeftSidebarOpen(!leftSidebarOpen)}
          onToggleRightSidebar={() => setRightSidebarOpen(!rightSidebarOpen)}
          leftSidebarOpen={leftSidebarOpen}
          rightSidebarOpen={rightSidebarOpen}
        />
      </div>

      {/* Right Sidebar (AI Chat) */}
      <div 
        className={`absolute inset-y-0 right-0 z-20 w-[85vw] max-w-80 flex-col border-l border-border bg-background shadow-xl xl:shadow-none xl:static xl:w-80 xl:max-w-none xl:bg-card/30 transition-transform duration-300 ease-in-out flex ${
          rightSidebarOpen ? "translate-x-0" : "translate-x-full xl:hidden"
        }`}
      >
        <AIChatSidebar documentId={documentId} editor={editor} />
      </div>
    </div>
  );
}