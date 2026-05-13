import { NextResponse } from "next/server";
import { verifyPaystackSignature } from "@/lib/paystack";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export const runtime = "nodejs";

function metadataUserId(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const meta = (data as { metadata?: unknown }).metadata;
  if (!meta || typeof meta !== "object") return null;
  const raw = (meta as { supabase_user_id?: unknown }).supabase_user_id;
  return typeof raw === "string" && raw.length > 0 ? raw : null;
}

function customerCode(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const c = (data as { customer?: unknown }).customer;
  if (!c || typeof c !== "object") return null;
  const code = (c as { customer_code?: unknown }).customer_code;
  return typeof code === "string" ? code : null;
}

function subscriptionCode(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const s = (data as { subscription?: unknown }).subscription;
  if (!s || typeof s !== "object") return null;
  const code = (s as { subscription_code?: unknown }).subscription_code;
  return typeof code === "string" ? code : null;
}

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const sig = req.headers.get("x-paystack-signature");

  if (!verifyPaystackSignature(rawBody, sig, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: { event?: string; data?: unknown };
  try {
    payload = JSON.parse(rawBody) as { event?: string; data?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (payload.event === "charge.success" && payload.data) {
    const userId = metadataUserId(payload.data);
    if (userId) {
      const supabase = createServiceRoleClient();
      const { error } = await supabase
        .from("profiles")
        .update({
          subscription_status: "active",
          paystack_customer_code: customerCode(payload.data),
          paystack_subscription_code: subscriptionCode(payload.data),
        })
        .eq("id", userId);

      if (error) {
        console.error("Paystack webhook: profile update failed", error);
        return NextResponse.json(
          { error: "Database update failed" },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
