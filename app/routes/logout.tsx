import type { LoaderFunction } from "@remix-run/server-runtime";
import { authenticator } from "~/services/resources";

export const loader: LoaderFunction = async ({ request }) => {
  return await authenticator.logout(request, {
    redirectTo: "/",
  });
};
