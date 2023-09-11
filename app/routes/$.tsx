import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const loader = () => {
  return json(null, { status: 404 });
};

export const handle = {
  hasNav: false,
};

export default function PageNotFound() {
  return (
    <main className="h-full flex flex-col justify-center items-center gap-4 bg-indigo-200">
      <div className="text-9xl font-extrabold">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-900">
          Oops!
        </span>
      </div>
      <h4 className="text-2xl font-medium text-slate-800">
        404 - Page not found
      </h4>
      <Link to="/" className="py-1 px-6 rounded-md bg-blue-900 text-white mt-2">
        Homepage
      </Link>
    </main>
  );
}
