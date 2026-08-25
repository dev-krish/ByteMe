import Link from "next/link";
import { Shield, ExternalLink, Globe, FileText, CheckCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#eee8d5]/80 border-t border-outline-variant/40 mt-auto text-on-surface-variant font-sans">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: System Identification */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-primary text-white flex items-center justify-center font-bold text-xs">
                GOI
              </div>
              <span className="font-bold text-base text-primary">NLAMS</span>
            </div>
            <p className="text-xs text-emphasis leading-relaxed">
              National Land Acquisition & Management System under the aegis of the Department of Land Resources, Ministry of Rural Development, Government of India.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-success-green">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>RFCTLARR-2013 Statutory Compliance Certified</span>
            </div>
          </div>

          {/* Col 2: Modules */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emphasis mb-3">
              Portal Modules
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/workflow" className="hover:text-primary transition-colors">
                  Section 4-38 Workflow Tracker
                </Link>
              </li>
              <li>
                <Link href="/gis-map" className="hover:text-primary transition-colors">
                  Cadastral GIS Map & Khasra Registry
                </Link>
              </li>
              <li>
                <Link href="/compensation" className="hover:text-primary transition-colors">
                  RFCTLARR Compensation Engine & PFMS
                </Link>
              </li>
              <li>
                <Link href="/executive-dashboard" className="hover:text-primary transition-colors">
                  National SLA & Monitoring Matrix
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Statutory References */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emphasis mb-3">
              Statutory Framework
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-emphasis">RFCTLARR Act, 2013 (Act 30 of 2013)</span>
              </li>
              <li>
                <span className="text-emphasis">First Schedule (Market Value & Solatium)</span>
              </li>
              <li>
                <span className="text-emphasis">Second & Third Schedules (R&R Entitlements)</span>
              </li>
              <li>
                <span className="text-emphasis">Section 10A Multi-crop Exemptions</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Technical & Helpline */}
          <div>
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emphasis mb-3">
              National Helpdesk
            </h4>
            <div className="space-y-2 text-xs text-emphasis">
              <p>Toll Free Helpline: 1800-11-NLAMS (65267)</p>
              <p>Email: helpdesk-nlams@gov.in</p>
              <p className="text-[11px]">Designed & Hosted by National Informatics Centre (NIC)</p>
            </div>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="border-t border-outline-variant/30 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-emphasis">
          <p>© {new Date().getFullYear()} National Land Acquisition & Management System. All Rights Reserved.</p>
          <div className="flex gap-4 mt-3 sm:mt-0">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <span>|</span>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
            <span>|</span>
            <Link href="#" className="hover:text-primary">Security Audit Clearance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
