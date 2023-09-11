import type { Upload, User } from "@prisma/client";
import Card from "./cards";

interface CardListProps {
  images: Array<
    Upload & {
      User: User;
    }
  >;
}

export default function CardList({ images }: CardListProps) {
  return (
    <div className="grid grid-cols-fluid py-[20px] px-[36px] gap-8">
      {images.map((image) => (
        <Card key={image.id} image={image} />
      ))}
    </div>
  );
}

export const ErrorBoundary = () => <h3>Whoops!</h3>;

export const CatchBoundary = () => <h3>Not found!</h3>;
