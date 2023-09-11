import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "invariant";
import { API } from "~/services";

export const meta: V2_MetaFunction = ({ data }) => {
  return [
    { title: `Discovery | ${data.name}` },
    { name: "description", content: "Welcome to discovery!" },
  ];
};

export const loader = async ({ params }: LoaderArgs) => {
  invariant(params.id, "Cannot find image");
  return json(await API.IMAGE.getBySlug(params.id));
};

export default function Art() {
  const image = useLoaderData<typeof loader>();

  return (
    <main className="h-full p-[36px]">
      <section className="flex flex-col lg:flex-row-reverse lg:gap-6 h-full">
        <header className="min-w-[30%]">
          <h2 className="font-medium text-xl">{image?.name}</h2>
          <p className="text-sm flex items-center mt-1">
            {image?.User?.username}
            <button
              className="text-sm ml-2 w-[20px] h-[20px] rounded-full bg-green-400 text-white"
              title="Follow"
            >
              +
            </button>
          </p>
          <ul className="flex flex-row gap-6 mb-6 lg:flex-col list-none mt-6 lg:mb:0">
            <li>
              <span className="rounded-full mb-2 bg-slate-200 block w-fit p-2 text-xs">
                AN
              </span>
              <span className="font-medium ">Owner</span>
            </li>
            <li>
              <span className="rounded-full mb-2 bg-slate-200 block w-fit p-2 text-xs">
                AN
              </span>
              <span className="font-medium ">Tools</span>
            </li>
            <li>
              <span className="rounded-full mb-2 bg-slate-200 block w-fit p-2 text-xs">
                AN
              </span>
              <span className="font-medium ">Save</span>
            </li>
            <li>
              <span className="rounded-full mb-2 bg-slate-200 block w-fit p-2 text-xs">
                AN
              </span>
              <span className="font-medium ">Appreciate</span>
            </li>
          </ul>
        </header>
        <picture className="w-full">
          <img
            src={image?.URL}
            alt={image?.name}
            className="object-cover aspect-square w-full h-full min-h-[300px]"
          />
        </picture>
      </section>
    </main>
  );
}
