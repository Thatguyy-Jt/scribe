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

  const toggleLeftSidebar = () => {
    if (!leftSidebarOpen && window.innerWidth < 1024) {
      setRightSidebarOpen(false);
    }
    setLeftSidebarOpen(!leftSidebarOpen);
  };

  const toggleRightSidebar = () => {
    if (!rightSidebarOpen && window.innerWidth < 1280) {
      setLeftSidebarOpen(false);
    }
    setRightSidebarOpen(!rightSidebarOpen);
  };

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] w-full overflow-hidden bg-background text-foreground relative">
      {/* Left/Top Sidebar (Knowledge) */}
      <div 
        className={`flex-col border-border bg-background lg:bg-card/30 transition-all duration-300 ease-in-out flex shrink-0 ${
          leftSidebarOpen 
            ? "h-[50%] border-b lg:h-auto lg:w-72 lg:border-b-0 lg:border-r" 
            : "h-0 border-b-0 lg:h-auto lg:w-0 lg:border-r-0 overflow-hidden lg:hidden"
        }`}
      >
        <div className="h-full w-full overflow-hidden flex flex-col">
          <KnowledgeSidebar documentId={documentId} />
        </div>
      </div>

      {/* Center - Editor Core */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 transition-all z-0">
        <DocumentEditor 
          documentId={documentId} 
          onEditorReady={setEditor} 
          onToggleLeftSidebar={toggleLeftSidebar}
          onToggleRightSidebar={toggleRightSidebar}
          leftSidebarOpen={leftSidebarOpen}
          rightSidebarOpen={rightSidebarOpen}
        />
      </div>

      {/* Right/Bottom Sidebar (AI Chat) */}
      <div 
        className={`flex-col border-border bg-background xl:bg-card/30 transition-all duration-300 ease-in-out flex shrink-0 ${
          rightSidebarOpen 
            ? "h-[50%] border-t xl:h-auto xl:w-80 xl:border-t-0 xl:border-l" 
            : "h-0 border-t-0 xl:h-auto xl:w-0 xl:border-l-0 overflow-hidden xl:hidden"
        }`}
      >
        <div className="h-full w-full overflow-hidden flex flex-col">
          <AIChatSidebar documentId={documentId} editor={editor} />
        </div>
      </div>
    </div>
  );
}