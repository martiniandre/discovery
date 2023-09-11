import type { ActionArgs, V2_MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";

import { Form, Link, useActionData } from "@remix-run/react";
import { API } from "~/services";
import { authenticator } from "~/services/resources";
import { validateEmail } from "~/utils";
import { PATHS } from "~/utils/routes";

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: "Discovery | Register",
      description:
        "Create your account and start to share or discovery new ideias",
    },
  ];
};

export const handle = {
  hasNav: false,
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  const email = formData.get("credential")?.toString();
  const username = formData.get("username")?.toString();
  const password = formData.get("password")?.toString();

  switch (intent) {
    case "validate-email": {
      if (!validateEmail(email)) {
        return json(
          {
            errors: {
              email: "Email is invalid",
              password: null,
              username: null,
            },
            nextStep: false,
          },
          { status: 400 }
        );
      }
      const existingUser = await API.USER.getUserByEmail(email);
      if (existingUser)
        return json(
          {
            errors: {
              email: "A user already exists with this email",
              password: null,
              username: null,
            },
            nextStep: false,
          },
          { status: 400 }
        );

      return json({
        errors: { email: null, password: null, username: null },
        nextStep: true,
      });
    }
    case "sign-up": {
      if (typeof username !== "string") {
        return json(
          {
            errors: {
              username: "Username is required",
              password: null,
              email: null,
            },
            nextStep: true,
          },
          { status: 400 }
        );
      }

      if (username.length < 4) {
        return json(
          {
            errors: {
              username: "Username is too short",
              password: null,
              email: null,
            },
            nextStep: true,
          },
          { status: 400 }
        );
      }

      const existingUser = await API.USER.getUserByUsername(username);
      if (existingUser) {
        return json(
          {
            errors: {
              email: "A user already exists with this username",
              password: null,
              username: null,
            },
            nextStep: true,
          },
          { status: 400 }
        );
      }

      if (typeof password !== "string") {
        return json(
          {
            errors: {
              password: "Password is required",
              username: null,
              email: null,
            },
            nextStep: true,
          },
          { status: 400 }
        );
      }

      if (password.length < 8) {
        return json(
          {
            errors: {
              password: "Password is too short, min 8 characters",
              username: null,
              email: null,
            },
            nextStep: true,
          },
          { status: 400 }
        );
      }

      if (!validateEmail(email)) {
        return json(
          {
            errors: {
              email: "Email is invalid",
              username: null,
              password: null,
            },
            nextStep: true,
          },
          { status: 400 }
        );
      }

      await API.USER.createUser(
        {
          email,
          username,
        },
        password
      );
      return await authenticator.authenticate("user-pass", request, {
        successRedirect: "/",
        failureRedirect: "./auth/sign-in",
        context: { formData },
      });
    }
    default: {
      throw new Error(`Unknown intent: ${intent}`);
    }
  }
};

export default function Register() {
  const actionResult = useActionData<typeof action>();

  return (
    <main className="h-full bg-blue-200 flex items-center justify-center">
      <section className="p-24 bg-white rounded-md shadow-lg">
        <h1 className="text-2xl font-medium">Sign up</h1>
        <Link to={PATHS.SIGN_IN} className="text-blue-600 text-sm ">
          Already have an account?
        </Link>
        <Form method="POST" className="mt-4">
          <div>
            <label htmlFor="credential" className="text-sm">
              Email address
            </label>
            <input
              type="email"
              required
              name="credential"
              className="w-full border-b-[1px] text-md border-slate-200 outline-none hover:border-slate-600 transition-all"
              id="credential"
            />
          </div>
          {actionResult?.nextStep ? (
            <>
              <div className="mt-4">
                <label htmlFor="username" className="text-sm">
                  Username
                </label>
                <input
                  type="text"
                  required
                  name="username"
                  className="w-full border-b-[1px] text-md border-slate-200 outline-none hover:border-slate-600 transition-all"
                  id="username"
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
            </>
          ) : null}
          {/* refactor this later*/}
          {Object.values(actionResult?.errors ?? {}).some(Boolean) ? (
            <ul className="py-2">
              {actionResult?.errors?.email ? (
                <li className="text-xs mt-1 text-red-600">
                  {actionResult?.errors?.email}
                </li>
              ) : null}
              {actionResult?.errors?.username ? (
                <li className="text-xs mt-1 text-red-600">
                  {actionResult?.errors?.username}
                </li>
              ) : null}
              {actionResult?.errors?.password ? (
                <li className="text-xs mt-1 text-red-600">
                  {actionResult?.errors?.password}
                </li>
              ) : null}
            </ul>
          ) : (
            <></>
          )}
          {!actionResult?.nextStep ? (
            <button
              type="submit"
              name="intent"
              value="validate-email"
              className="ml-auto block text-sm text-white font-medium bg-blue-600 rounded-lg mt-3 p-1 px-4 hover:bg-blue-500 transition-all"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              name="intent"
              value="sign-up"
              className="ml-auto block text-sm text-white font-medium bg-blue-600 rounded-lg mt-3 p-1 px-4 hover:bg-blue-500 transition-all"
            >
              Continue
            </button>
          )}
        </Form>
      </section>
    </main>
  );
}

export const ErrorBoundary = () => <h3>Whoops!</h3>;

export const CatchBoundary = () => <h3>Not found!</h3>;
