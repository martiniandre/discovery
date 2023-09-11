import { redirect } from "@remix-run/node";

export const loader = () => {
  return redirect("/search");
};

export default function Index() {
  return "";
}
