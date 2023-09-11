import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderArgs } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";

import tailwind from "~/tailwind.css";
import Layout from "./components/layout";
import { authenticator } from "./services/resources";
import type { User } from "@prisma/client";
import toastStyles from "./shared/hooks/useToast/styles.css";

export const links: LinksFunction = () => [
  ...(cssBundleHref
    ? [{ rel: "stylesheet", href: cssBundleHref }]
    : [
        { rel: "stylesheet", href: tailwind },
        { rel: "stylesheet", href: toastStyles },
      ]),
];

export const loader = async ({ request }: LoaderArgs) => {
  return await authenticator.isAuthenticated(request);
};

export default function App() {
  const user = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        ></meta>
        <Meta />
        <Links />
      </head>
      <body>
        <Layout user={user as User | null}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
