/**
 * Monthly subscription in whole Nigerian naira. Your Paystack plan must use the
 * same face value: **kobo** = whole naira × 100 (20,000 NGN → 2,000,000 kobo).
 */
export const MONTHLY_PRICE_NGN = 20_000;

/** Whole naira for display and for matching the Paystack plan amount. */
export function getMonthlyNgnWhole(): number {
  return MONTHLY_PRICE_NGN;
}

/** Paystack plan `amount` field for NGN (kobo). */
export function getMonthlyPaystackAmountKobo(): number {
  return MONTHLY_PRICE_NGN * 100;
}

export function formatNgn(wholeNaira: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(wholeNaira);
}
