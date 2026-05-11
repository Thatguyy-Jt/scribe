"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function createDocument() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data, error } = await supabase
    .from("documents")
    .insert([
      {
        user_id: user.id,
        title: "Untitled Document",
        content: { type: "doc", content: [{ type: "paragraph" }] },
      },
    ])
    .select("id")
    .single();

  if (error || !data) {
    console.error("Error creating document:", error);
    throw new Error("Failed to create document");
  }

  redirect(`/documents/${data.id}`);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}