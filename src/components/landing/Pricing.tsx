import { Check } from "lucide-react";
import Link from "next/link";
import { formatNgn, getMonthlyNgnWhole } from "@/lib/pricing";

export function Pricing() {
  const ngnMonth = getMonthlyNgnWhole();
  const ngnLabel = formatNgn(ngnMonth);

  return (
    <section id="pricing" className="relative py-16 sm:py-24 z-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Try Scribe free for three days, then subscribe at{" "}
            <span className="text-white/90">{ngnLabel}</span> per month, billed in
            Nigerian naira through Paystack.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <div className="rounded-2xl sm:rounded-3xl border border-blue-500/30 bg-gradient-to-b from-[#1a2035] to-card p-6 sm:p-8 flex flex-col relative shadow-2xl shadow-blue-900/20">
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Scribe
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Full access</h3>
            <p className="text-blue-100/70 text-sm mb-6">
              3-day free trial, then monthly billing through Paystack (NGN).
            </p>
            <div className="mb-1">
              <span className="text-4xl font-extrabold text-white">
                {ngnLabel}
              </span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <p className="text-sm text-blue-100/80 mb-8">
              Same amount after your 3-day trial — ensure your Paystack plan is set to{" "}
              {ngnLabel}/month (NGN).
            </p>
            <ul className="flex-1 space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-white">
                <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                3-day free trial — no charge until trial ends
              </li>
              <li className="flex items-center gap-3 text-sm text-white">
                <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                Unlimited documents
              </li>
              <li className="flex items-center gap-3 text-sm text-white">
                <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                Unlimited AI queries
              </li>
              <li className="flex items-center gap-3 text-sm text-white">
                <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                Advanced formatting & exports
              </li>
            </ul>
            <Link
              href="/signup"
              className="w-full inline-flex justify-center rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-3 text-sm font-medium text-white transition-colors shadow-lg shadow-blue-500/25"
            >
              Start free trial
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
