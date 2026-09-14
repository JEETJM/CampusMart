import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BrainCircuit,
  // Github,
  Heart,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* BRAND */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="rounded-xl bg-blue-600 p-2 text-white">
                <ShoppingBag size={21} />
              </div>

              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Campus<span className="text-blue-600">Mart</span>
                  <span className="ml-1.5 text-xs text-indigo-500">AI</span>
                </h2>
              </div>
            </Link>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
              An AI-powered student-to-student marketplace where students can
              buy, sell, exchange and rent products within their campus
              community.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">
                <ShieldCheck size={15} />
                Verified Students
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
                <BrainCircuit size={15} />
                AI Powered
              </div>
            </div>
          </div>

          {/* MARKETPLACE */}
          <div>
            <h3 className="font-semibold text-slate-900">Marketplace</h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li>
                <Link
                  to="/marketplace"
                  className="transition hover:text-blue-600"
                >
                  Buy Products
                </Link>
              </li>

              <li>
                <Link to="/register" className="transition hover:text-blue-600">
                  Sell Products
                </Link>
              </li>

              <li>
                <Link
                  to="/marketplace"
                  className="transition hover:text-blue-600"
                >
                  Exchange
                </Link>
              </li>

              <li>
                <Link
                  to="/marketplace"
                  className="transition hover:text-blue-600"
                >
                  Rent
                </Link>
              </li>
            </ul>
          </div>

          {/* PROJECT */}
          <div>
            <h3 className="font-semibold text-slate-900">CampusMart AI</h3>

            <ul className="mt-4 space-y-3 text-sm text-slate-500">
              <li className="flex items-center gap-2">
                <BrainCircuit size={15} />
                AI Smart Finder
              </li>

              <li className="flex items-center gap-2">
                <ShieldCheck size={15} />
                AI Scam Detection
              </li>

              <li className="flex items-center gap-2">
                <ShoppingBag size={15} />
                Student Commerce
              </li>

              <li>
                <a
                  href="https://github.com/JEETJM/CampusMart"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 transition hover:text-blue-600"
                >
                  GitHub
                  <ArrowUpRight size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-6 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} CampusMart AI. All rights reserved.
          </p>

          <p className="flex items-center gap-1">
            Built for students with
            <span className="font-semibold text-red-500">JASI❤️</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
