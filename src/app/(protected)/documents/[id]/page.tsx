import { DocumentWorkspace } from "@/components/editor/DocumentWorkspace";

interface DocumentPageProps {
  params: {
    id: string;
  };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  // Await the params object before accessing properties
  const resolvedParams = await params;
  const documentId = resolvedParams.id;

  return <DocumentWorkspace documentId={documentId} />;
}