import type {
  ActionArgs,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";

import { Form, Link, useActionData } from "@remix-run/react";
import { AuthorizationError } from "remix-auth";
import { authenticator } from "~/services/resources";
import { PATHS } from "~/utils/routes";

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: "Discovery | Login",
      description:
        "Create your account and start to share or discovery new ideias",
    },
  ];
};

interface ActionResponse {
  errors: {
    credentials: string | null;
  };
}

export const handle = {
  hasNav: false,
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const credential = formData.get("credential")?.toString();
  const password = formData.get("password")?.toString();

  if (typeof credential !== "string") {
    return json(
      {
        errors: {
          credentials: "Email/Username is required",
        },
      },
      { status: 400 }
    );
  }

  if (typeof password !== "string") {
    return json(
      {
        errors: {
          credentials: "Password is required",
        },
      },
      { status: 400 }
    );
  }

  try {
    return await authenticator.authenticate("user-pass", request, {
      successRedirect: "/",
      throwOnError: true,
      context: { formData },
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Response) return error;
    if (error instanceof AuthorizationError) {
      return json(
        { errors: { credentials: "Invalid credentials" } },
        { status: 400 }
      );
    }
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (user) {
    return redirect("/");
  }
  return {};
};

export default function Login() {
  const actionResult = useActionData<ActionResponse>();

  return (
    <main className="h-full bg-blue-200 flex items-center justify-center">
      <section className="p-24 bg-white rounded-md shadow-lg">
        <h1 className="text-2xl font-medium">Sign in</h1>
        <p className="text-sm mt-1">
          New user?
          <Link to={PATHS.SIGN_UP} className="text-blue-600 ml-1">
            Create an account
          </Link>
        </p>
        <Form method="POST" className="mt-4">
          <div>
            <label htmlFor="email" className="text-sm">
              Email/Username
            </label>
            <input
              type="text"
              required
              name="credential"
              className="w-full border-b-[1px] text-md border-slate-200 outline-none hover:border-slate-600 transition-all"
              id="credential"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="password" className="text-sm">
              Password
            </label>
            <input
              type="password"
              required
              name="password"
              className="w-full border-b-[1px] text-md border-slate-200 outline-none hover:border-slate-600 transition-all"
              id="password"
            />
          </div>
          {actionResult?.errors.credentials ? (
            <ul className="py-2">
              <li className="text-xs mt-1 text-red-600">
                {actionResult?.errors?.credentials}
              </li>
            </ul>
          ) : null}
          <button
            type="submit"
            className="ml-auto  block text-sm text-white font-medium bg-blue-600 rounded-lg mt-3 p-1 px-4 hover:bg-blue-500 transition-all"
          >
            Login
          </button>
        </Form>
      </section>
    </main>
  );
}

export const ErrorBoundary = () => <h3>Whoops!</h3>;

export const CatchBoundary = () => <h3>Not found!</h3>;
