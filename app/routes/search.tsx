import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import type { ShouldRevalidateFunction } from "@remix-run/react";
import { NavLink, useLoaderData } from "@remix-run/react";
import CardList from "~/components/Cards/card-list";
import { API } from "~/services";
import { ROUTES } from "~/utils";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Discovery | Search" },
    { name: "description", content: "Welcome to discovery!" },
  ];
};

export const loader = async ({ params }: LoaderArgs) => {
  const images = await API.IMAGE.listAll();
  return json(images);
};

export const shouldRevalidate: ShouldRevalidateFunction = ({
  currentParams,
  nextParams,
  defaultShouldRevalidate,
}) => {
  if (currentParams !== nextParams) {
    return true;
  }

  return defaultShouldRevalidate;
};

export default function Search() {
  const images = useLoaderData();

  return (
    <>
      <div className="py-8 px-[36px] text-md">
        <div className="flex items-center flex-col md:flex-row">
          <div className="flex items-center gap-2 border-r w-full px-4 border border-slate-200 md:rounded-s-3xl h-16 text-lg">
            <input
              placeholder="Search to discovery"
              className="outline-none w-full "
            />
          </div>
          <div className="flex items-center gap-4 border-r w-full md:basis-5/12 justify-evenly border border-slate-200 md:rounded-r-3xl h-16 md:border-l-0 px-6 font-medium">
            <NavLink
              className="py-1 px-3 text-sm rounded-2xl hover:bg-slate-200"
              to={ROUTES.PATHS.SEARCH_BY("images")}
            >
              Images
            </NavLink>
            <NavLink
              className="py-1 px-3 text-sm rounded-2xl hover:bg-slate-200"
              to={ROUTES.PATHS.SEARCH_BY("assets")}
            >
              Assets
            </NavLink>
            <NavLink
              className="py-1 px-3 text-sm rounded-2xl hover:bg-slate-200"
              to={ROUTES.PATHS.SEARCH_BY("user")}
            >
              User
            </NavLink>
          </div>
        </div>
      </div>
      <CardList images={images} />
    </>
  );
}
