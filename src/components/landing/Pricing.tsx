import { Check } from "lucide-react";
import Link from "next/link";

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 z-10">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground text-lg">
            Start for free, upgrade when you need more power and team collaboration features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Free Tier */}
          <div className="rounded-3xl border border-border bg-card p-8 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">Free</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Perfect for individuals just getting started with AI documentation.
            </p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-white">$0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="flex-1 space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                Up to 5 documents
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                50 AI queries per month
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                Basic templates
              </li>
            </ul>
            <Link
              href="/signup"
              className="w-full inline-flex justify-center rounded-xl border border-white/20 bg-transparent hover:bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-b from-[#1a2035] to-card p-8 flex flex-col relative shadow-2xl shadow-blue-900/20">
            <div className="absolute top-0 right-8 transform -translate-y-1/2">
              <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Popular
              </span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Pro</h3>
            <p className="text-blue-100/70 text-sm mb-6">
              For professionals who need unlimited power and flexibility.
            </p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-white">$15</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="flex-1 space-y-4 mb-8">
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
              <li className="flex items-center gap-3 text-sm text-white">
                <Check className="h-5 w-5 text-blue-400 flex-shrink-0" />
                Priority support
              </li>
            </ul>
            <Link
              href="/signup"
              className="w-full inline-flex justify-center rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-3 text-sm font-medium text-white transition-colors shadow-lg shadow-blue-500/25"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Enterprise Tier */}
          <div className="rounded-3xl border border-border bg-card p-8 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Custom solutions for large teams with advanced security needs.
            </p>
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-white">Custom</span>
            </div>
            <ul className="flex-1 space-y-4 mb-8">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                Everything in Pro
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                SAML SSO & Advanced Security
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                Custom SLAs
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                Dedicated success manager
              </li>
            </ul>
            <Link
              href="#contact"
              className="w-full inline-flex justify-center rounded-xl border border-white/20 bg-transparent hover:bg-white/5 px-4 py-3 text-sm font-medium text-white transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}