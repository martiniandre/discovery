import { Authenticator } from "remix-auth";
import { sessionStorage } from "./session.server";
import { FormStrategy } from "remix-auth-form";
import { API } from "..";
import invariant from "invariant";
import type { User } from "@prisma/client";

export let authenticator = new Authenticator<User | null>(sessionStorage);

const formStrategy = new FormStrategy(async ({ form }) => {
  let credentials = form.get("credential"); // or email... etc
  let password = form.get("password");
  // You can validate the inputs however you want
  invariant(typeof credentials === "string", "credentials must be a string");
  invariant(credentials.length > 0, "credentials must not be empty");

  invariant(typeof password === "string", "password must be a string");
  invariant(password.length > 0, "password must not be empty");

  const user = await API.USER.verifyLogin(credentials, password);
  if (!user) throw new Error("");
  return user;
});

authenticator.use(formStrategy, "user-pass");
