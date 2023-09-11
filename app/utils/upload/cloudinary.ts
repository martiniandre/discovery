import {
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  writeAsyncIterableToWritable,
} from "@remix-run/node";
import type { UploadApiResponse } from "cloudinary";
import cloudinary from "cloudinary";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

async function uploadImageToCloudinary(data: AsyncIterable<Uint8Array>) {
  const uploadPromise = new Promise(async (resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      {
        folder: "mixed",
      },
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    );
    await writeAsyncIterableToWritable(data, uploadStream);
  });

  return uploadPromise as Promise<UploadApiResponse>;
}

export const uploadHandler = unstable_composeUploadHandlers(
  async ({ name, data }) => {
    if (name !== "file-to-upload" || !data) {
      return undefined;
    }

    return await uploadImageToCloudinary(data)
      .then((resp) => {
        return resp.public_id;
      })
      .catch((error) => {
        console.log(error);
        return null;
      });
  },
  unstable_createMemoryUploadHandler()
);
