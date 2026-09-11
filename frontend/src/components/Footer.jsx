function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h2 className="text-xl font-bold">
              Campus<span className="text-blue-600">Mart</span>
            </h2>

            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
              A student-to-student marketplace to buy, sell, exchange and rent
              products within your campus community.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Marketplace</h3>

            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li>Buy Products</li>
              <li>Sell Products</li>
              <li>Exchange</li>
              <li>Rent</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900">Project</h3>

            <p className="mt-3 text-sm text-slate-500">
              MERN Stack Full-Stack Web Application
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} CampusMart. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
