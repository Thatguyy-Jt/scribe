import { Clock, Zap, RefreshCw, Sliders, ShieldCheck } from "lucide-react";

export function Features() {
  return (
    <section className="relative py-24 z-10">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        
        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-[minmax(300px,auto)]">
          
          {/* Card 1 - Large Left */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-card border border-border p-8 md:p-10 hover:border-white/20 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                  Build knowledge bases effortlessly
                </h3>
                <p className="text-muted-foreground text-lg max-w-md">
                  Leverage intelligent automation to construct comprehensive SOPs and workflow documentation in record time. Your team's expertise, captured and formatted instantly.
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center text-accent">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Emily Kilgore</p>
                  <p className="text-xs text-muted-foreground">Dir. of Learning & Development</p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 - Top Right Small */}
          <div className="group relative overflow-hidden rounded-3xl bg-card border border-border p-8 hover:border-white/20 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Accelerated writing
              </h3>
              <p className="text-muted-foreground text-sm">
                Skip the blank page phase. Scribe's AI instantly drafts concise summaries and step-by-step instructions for you.
              </p>
              <div className="mt-6 flex justify-center">
                <div className="bg-muted p-4 rounded-xl border border-border shadow-inner flex items-center gap-3 w-full">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  <span className="text-sm font-medium">AI Generated</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 - Bottom Left Small */}
          <div className="group relative overflow-hidden rounded-3xl bg-card border border-border p-8 hover:border-white/20 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <h3 className="text-xl font-bold text-foreground mb-3">
                Always synchronized
              </h3>
              <p className="text-muted-foreground text-sm">
                Keep your entire organization on the same page. Modify a workflow once, and those changes cascade across all shared documentation in real-time.
              </p>
            </div>
          </div>

          {/* Card 4 - Bottom Right Large */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-card border border-border p-8 md:p-10 hover:border-white/20 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-tl from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Total creative control
                </h3>
                <p className="text-muted-foreground text-lg max-w-md">
                  While AI handles the heavy formatting and generation, you retain full editorial authority. Tweak steps, insert critical warnings, and easily mask proprietary data.
                </p>
              </div>
              <div className="mt-8 flex justify-end">
                <div className="bg-[#1a2035] rounded-2xl p-4 border border-border flex flex-col gap-2 w-64 shadow-2xl">
                  <div className="flex items-center justify-between pb-2 border-b border-white/5">
                    <span className="text-xs font-semibold text-white">Customization</span>
                    <Sliders className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-muted-foreground">Show Step Count</span>
                    <div className="w-6 h-3 bg-blue-500 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-xs text-muted-foreground">Show Author</span>
                    <div className="w-6 h-3 bg-blue-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Security Section */}
        <div className="mt-24 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-card border border-border mb-8">
            <ShieldCheck className="h-8 w-8 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Data security</h2>
          <p className="text-muted-foreground text-lg mb-12">
            The security of your data is paramount. Scribe is committed to providing clear and straightforward information on AI and your data.
          </p>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div>
              <h4 className="text-white font-semibold flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Your privacy is the priority
              </h4>
              <p className="text-sm text-muted-foreground">Your data is never used to train our models. We use strict limitations on how data can be used.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> No long-term data storage
              </h4>
              <p className="text-sm text-muted-foreground">Every 30 days, AI service providers delete any Scribe user data processed for services.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Rigorous security controls
              </h4>
              <p className="text-sm text-muted-foreground">We meet or exceed rigorous security controls including data encryption and backups.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
