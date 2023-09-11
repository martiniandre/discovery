import type { User } from "@prisma/client";
import { Link, NavLink } from "@remix-run/react";
import { ROUTES } from "~/utils";

const NAV_LINKS = [
  {
    to: "discovery",
    label: "Discovery",
  },
  {
    to: "authors",
    label: "Authors",
  },
  {
    to: "images",
    label: "Authors",
  },
  {
    to: "assets",
    label: "Assets",
  },
  {
    to: "upload",
    label: "Upload",
  },
];

interface NavbarProps {
  user: User | null;
}

export default function Navbar({ user }: NavbarProps) {
  return (
    <nav className="flex items-center justify-between text-md border-[1px] border-slate-200 px-6">
      <ul className="flex items-center- gap-2 font-medium">
        <li className="p-3 text-lg">
          <Link to={ROUTES.PATHS.HOME} prefetch="render">{`D!SCOVER:)`}</Link>
        </li>

        {NAV_LINKS.map(({ to, label }) => (
          <li key={to} className="p-3 hidden md:flex">
            <NavLink to={to}>{label}</NavLink>
          </li>
        ))}
      </ul>
      <div className="gap-2 font-medium items-center text-sm hidden md:flex">
        {user ? (
          <>
            <span className="mr-3">Hello, {user.username}</span>
            <Link
              to="/logout
              "
              className="py-1 px-5 rounded-md bg-red-600 text-white"
            >
              Logout
            </Link>
          </>
        ) : (
          <>
            <Link
              to={ROUTES.PATHS.SIGN_IN}
              className="py-1 px-5 rounded-md bg-slate-200 text-blue-500"
            >
              Login
            </Link>
            <Link
              to={ROUTES.PATHS.SIGN_UP}
              className="py-1 px-5 rounded-md text-white bg-blue-500"
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
