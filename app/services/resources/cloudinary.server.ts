import cloudinary from "cloudinary";

export function retrieveImageURL(
  public_id: string,
  options?:
    | cloudinary.TransformationOptions
    | cloudinary.ConfigAndUrlOptions
    | undefined
) {
  return cloudinary.v2.url(public_id, options);
}
