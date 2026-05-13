import { createHmac, timingSafeEqual } from "node:crypto";

const PAYSTACK_API = "https://api.paystack.co";

export function verifyPaystackSignature(
  rawBody: string,
  signatureHeader: string | null,
  secretKey: string
): boolean {
  if (!signatureHeader) return false;
  const expected = createHmac("sha512", secretKey).update(rawBody).digest("hex");
  try {
    return (
      expected.length === signatureHeader.length &&
      timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(signatureHeader, "utf8"))
    );
  } catch {
    return false;
  }
}

export async function paystackInitializeTransaction(body: Record<string, unknown>) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("Missing PAYSTACK_SECRET_KEY");
  }
  const res = await fetch(`${PAYSTACK_API}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  let json: PaystackInitializeResponse;
  try {
    json = (await res.json()) as PaystackInitializeResponse;
  } catch {
    throw new Error(`Paystack returned non-JSON (${res.status})`);
  }
  if (!res.ok || !json.status) {
    const msg =
      json.message ||
      (Array.isArray(json.messages) ? json.messages.join(", ") : null) ||
      `Paystack error (${res.status})`;
    throw new Error(msg);
  }
  return json;
}

/** Minimal typing for Paystack initialize response. */
export type PaystackInitializeResponse = {
  status: boolean;
  message?: string;
  messages?: string[];
  data?: {
    authorization_url?: string;
    access_code?: string;
    reference?: string;
  };
};
