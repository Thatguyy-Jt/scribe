import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { paystackInitializeTransaction } from "@/lib/paystack";

export async function POST(req: Request) {
  if (!process.env.PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { error: "Paystack is not configured (PAYSTACK_SECRET_KEY)" },
      { status: 500 }
    );
  }

  // Plan amount/currency is defined in Paystack (NGN). Match MONTHLY_PRICE_NGN in src/lib/pricing.ts.

  const plan = process.env.PAYSTACK_PLAN_CODE;
  if (!plan) {
    return NextResponse.json(
      { error: "Paystack plan is not configured (PAYSTACK_PLAN_CODE)" },
      { status: 500 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("subscription_status")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.subscription_status === "active") {
    return NextResponse.json({ error: "Already subscribed" }, { status: 400 });
  }

  const origin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    new URL(req.url).origin;
  const callback_url = `${origin}/billing`;

  try {
    const result = await paystackInitializeTransaction({
      email: user.email,
      plan,
      callback_url,
      metadata: { supabase_user_id: user.id },
    });

    const authorization_url = result.data?.authorization_url;
    if (!authorization_url) {
      return NextResponse.json(
        { error: "No authorization URL from Paystack" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      authorization_url,
      reference: result.data?.reference ?? null,
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "Paystack initialize failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
