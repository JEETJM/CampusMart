import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-7xl font-bold text-blue-600">404</h1>

      <h2 className="mt-4 text-2xl font-bold">
        Page Not Found
      </h2>

      <p className="mt-2 text-slate-500">
        The page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
      >
        Back to Home
      </Link>
    </section>
  );
}

export default NotFound;