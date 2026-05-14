import type { Editor } from "@tiptap/react";

/** Payload appended by the AI as the last line of a message (see system prompt in chat route). */
export type ScribeReplacePayload = { find: string; replace: string };

/**
 * If the assistant ends the message with SCRIBE_REPLACE:{...json...}, split body vs meta.
 * JSON must be a single line after the prefix.
 */
export function splitScribeMeta(raw: string): { body: string; meta: ScribeReplacePayload | null } {
  const lines = raw.split("\n");
  let i = lines.length - 1;
  while (i >= 0 && lines[i].trim() === "") i--;
  if (i < 0) return { body: raw, meta: null };

  const candidate = lines[i].trim();
  const prefix = "SCRIBE_REPLACE:";
  if (!candidate.startsWith(prefix)) {
    return { body: raw, meta: null };
  }

  const jsonPart = candidate.slice(prefix.length);
  try {
    const parsed = JSON.parse(jsonPart) as unknown;
    if (
      parsed &&
      typeof parsed === "object" &&
      typeof (parsed as { find?: unknown }).find === "string" &&
      typeof (parsed as { replace?: unknown }).replace === "string"
    ) {
      const find = (parsed as { find: string }).find;
      const replace = (parsed as { replace: string }).replace;
      if (find.length > 0) {
        const body = lines.slice(0, i).join("\n").replace(/\s+$/, "");
        return { body, meta: { find, replace } };
      }
    }
  } catch {
    /* invalid JSON while streaming or model typo */
  }
  return { body: raw, meta: null };
}

/**
 * Text shown in the chat bubble: hide completed meta lines; while streaming, hide a partial SCRIBE_REPLACE line.
 */
export function getAssistantDisplayText(raw: string, hideIncompleteMeta: boolean): string {
  const withMeta = splitScribeMeta(raw);
  if (withMeta.meta) return withMeta.body;

  if (!hideIncompleteMeta) return raw;

  const lines = raw.split("\n");
  let i = lines.length - 1;
  while (i >= 0 && lines[i].trim() === "") i--;
  if (i < 0) return raw;
  const last = lines[i].trimStart();
  if (last.startsWith("SCRIBE_REPLACE")) {
    return lines.slice(0, i).join("\n").replace(/\s+$/, "");
  }
  return raw;
}

/**
 * Find `find` in the document (first text-node match) and replace with plain `replace` string.
 */
export function replaceInEditor(editor: Editor, find: string, replace: string): boolean {
  if (!find) return false;

  const { state } = editor;
  const { doc } = state;
  let from: number | null = null;
  let to: number | null = null;

  doc.descendants((node, pos) => {
    if (node.isText && node.text) {
      const idx = node.text.indexOf(find);
      if (idx !== -1) {
        from = pos + idx;
        to = pos + idx + find.length;
        return false;
      }
    }
  });

  if (from == null || to == null) return false;

  editor.chain().focus().deleteRange({ from, to }).insertContentAt(from, replace).run();
  return true;
}
