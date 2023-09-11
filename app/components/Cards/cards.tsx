import type { Upload, User } from "@prisma/client";
import { Link } from "@remix-run/react";
import { ROUTES } from "~/utils";

interface CardImageProps {
  image: Upload & {
    User: User;
  };
}

export default function CardImage({ image }: CardImageProps) {
  return (
    <div className="group">
      <Link
        prefetch="render"
        to={ROUTES.PATHS.ART_GALLERY(image.id)}
        className="cursor-pointer relative"
      >
        <img
          src={image.previewURL}
          className="aspect-auto object-cover h-[250px] w-full transition-all ease-in-out duration-500 group-hover:brightness-[0.60]"
          alt="img"
        />
      </Link>
      <div className="py-2">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-sm font-medium">
            {image.name}
          </Link>
          {/* <div className="text-sm">
            <span className="mr-2">Likes: 1000</span>
            <span>Views: 1000</span>
          </div> */}
        </div>
        <p className="text-xs text-slate-500">{image.User.username}</p>
      </div>
    </div>
  );
}
