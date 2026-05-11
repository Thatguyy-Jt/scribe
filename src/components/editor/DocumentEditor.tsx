"use client";

import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { useEffect, useState } from "react";
import { useDocument } from "@/hooks/useDocument";
import { useAutoSave } from "@/hooks/useAutoSave";
import { DocumentHeader } from "./DocumentHeader";
import { EditorToolbar } from "./EditorToolbar";
import { Loader2, AlertTriangle } from "lucide-react";

interface DocumentEditorProps {
  documentId: string;
  onEditorReady?: (editor: Editor) => void;
  onToggleLeftSidebar?: () => void;
  onToggleRightSidebar?: () => void;
  leftSidebarOpen?: boolean;
  rightSidebarOpen?: boolean;
}

export function DocumentEditor({ 
  documentId, 
  onEditorReady,
  onToggleLeftSidebar,
  onToggleRightSidebar,
  leftSidebarOpen,
  rightSidebarOpen
}: DocumentEditorProps) {
  const { document, loading, error, saveDocument, saveStatus, setSaveStatus } = useDocument(documentId);
  const [title, setTitle] = useState("Untitled Document");

  // Keep local title in sync with remote document on initial load
  useEffect(() => {
    if (document && document.title) {
      setTitle(document.title);
    }
  }, [document?.title]); // Only depend on the title changing

  const { scheduleSave, hasPendingChanges } = useAutoSave(async (newTitle, newContent) => {
    await saveDocument(newTitle, newContent);
  });

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Start typing your knowledge base here...",
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      const json = editor.getJSON();
      setSaveStatus("idle"); // reset status so user knows it hasn't saved yet
      scheduleSave(title, json);
    },
    editorProps: {
      attributes: {
        class: "prose prose-slate dark:prose-invert prose-headings:font-serif prose-p:font-serif mx-auto focus:outline-none min-h-[500px] px-8 py-8 w-full max-w-3xl tiptap",
      },
    },
  });

  useEffect(() => {
    if (editor && onEditorReady) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Update editor content ONLY when document is first loaded
  useEffect(() => {
    if (editor && document?.content && !editor.isFocused) {
      const currentText = editor.getText();
      if (!currentText && document.content?.type === "doc") {
         editor.commands.setContent(document.content);
      }
    }
  }, [editor, document?.id]);

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setSaveStatus("idle");
    if (editor) {
      scheduleSave(newTitle, editor.getJSON());
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-h-0 bg-background overflow-hidden relative">
        {/* Header Skeleton */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-6">
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-lg bg-card animate-pulse" />
            <div className="h-8 w-8 rounded-lg bg-card animate-pulse" />
            <div className="h-8 w-64 rounded bg-card animate-pulse ml-2" />
          </div>
          <div className="flex items-center gap-4">
            <div className="h-4 w-16 rounded bg-card animate-pulse" />
            <div className="h-8 w-8 rounded-lg bg-card animate-pulse" />
          </div>
        </header>
        
        {/* Toolbar Skeleton */}
        <div className="border-b border-border bg-card/30 p-2 flex flex-wrap gap-1 items-center justify-center sm:justify-start overflow-x-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-8 w-8 rounded bg-border/50 animate-pulse m-0.5" />
          ))}
          <div className="h-6 w-px bg-border mx-1 my-1" />
          {[...Array(3)].map((_, i) => (
            <div key={i+6} className="h-8 w-8 rounded bg-border/50 animate-pulse m-0.5" />
          ))}
        </div>

        {/* Editor Content Skeleton */}
        <div className="flex-1 p-8 md:p-12 mx-auto w-full max-w-3xl space-y-4">
          <div className="h-10 w-3/4 bg-card rounded animate-pulse mb-8" />
          <div className="h-4 w-full bg-card rounded animate-pulse" />
          <div className="h-4 w-full bg-card rounded animate-pulse" />
          <div className="h-4 w-5/6 bg-card rounded animate-pulse" />
          <div className="h-4 w-full bg-card rounded animate-pulse mt-6" />
          <div className="h-4 w-4/5 bg-card rounded animate-pulse" />
          <div className="h-4 w-full bg-card rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-background">
        <div className="h-16 w-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-white mb-2">Error loading document</h2>
        <p className="text-muted-foreground max-w-md">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-background overflow-hidden relative">
      <DocumentHeader 
        title={title} 
        onTitleChange={handleTitleChange} 
        saveStatus={saveStatus}
        hasPendingChanges={hasPendingChanges}
        onToggleLeftSidebar={onToggleLeftSidebar}
        onToggleRightSidebar={onToggleRightSidebar}
        leftSidebarOpen={leftSidebarOpen}
        rightSidebarOpen={rightSidebarOpen}
      />
      <EditorToolbar editor={editor} />
      <div className="flex-1 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}