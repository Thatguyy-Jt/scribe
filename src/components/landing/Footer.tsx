import Link from "next/link";
import { GitBranch, Mail, Globe, Hexagon } from "lucide-react";

export function Footer() {
  return (
    <>
      {/* Bottom CTA */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-blue-600 to-cyan-500 rounded-3xl p-12 text-center md:py-20 md:px-16 shadow-2xl shadow-blue-500/20">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Brilliantly efficient. <br /> Powered by AI.
          </h2>
          <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            The future of documentation is here.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-full bg-white text-blue-600 px-8 py-3.5 text-base font-bold shadow-sm transition-all hover:scale-105"
          >
            Try Scribe free
          </Link>
        </div>
      </section>

      {/* Main Footer */}
      <footer className="border-t border-border bg-[#030409] py-16 text-sm">
        <div className="mx-auto max-w-6xl px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Brand Col */}
            <div className="col-span-2 flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <Hexagon className="w-5 h-5 text-white fill-white/20" />
                </div>
                <span className="font-bold text-xl tracking-tight text-white">
                  Scribe
                </span>
              </div>
              <p className="text-muted-foreground max-w-xs">
                Smarter documentation software, powered by AI.
              </p>
              <div className="flex gap-4 text-muted-foreground mt-4">
                <Link href="#" className="hover:text-white transition-colors"><Globe className="h-5 w-5" /></Link>
                <Link href="#" className="hover:text-white transition-colors"><Mail className="h-5 w-5" /></Link>
                <Link href="#" className="hover:text-white transition-colors"><GitBranch className="h-5 w-5" /></Link>
              </div>
            </div>

            {/* Links Cols */}
            <div>
              <h3 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">Product</h3>
              <ul className="flex flex-col gap-3 text-muted-foreground">
                <li><Link href="#" className="hover:text-white transition-colors">Scribe</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Scribe AI</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">Company</h3>
              <ul className="flex flex-col gap-3 text-muted-foreground">
                <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Careers <span className="ml-2 rounded-full bg-blue-500/20 text-blue-400 px-2 py-0.5 text-[10px] font-bold">HIRING</span></Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Contact Sales</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-white mb-4 uppercase tracking-wider text-xs">Legal</h3>
              <ul className="flex flex-col gap-3 text-muted-foreground">
                <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
              </ul>
            </div>

          </div>
          
          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Scribe. All rights reserved.</p>
            <p>SOC 2 Compliant</p>
          </div>
        </div>
      </footer>
    </>
  );
}
