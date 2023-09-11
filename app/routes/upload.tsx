import type {
  ActionArgs,
  LoaderFunction,
  V2_MetaFunction,
} from "@remix-run/node";
import {
  json,
  redirect,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { API } from "~/services";

import { authenticator, cloudinary } from "~/services/resources";
import { useToast } from "~/shared/hooks";
import { uploadHandler } from "~/utils/upload/cloudinary";

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: "Discovery | Upload",
      description:
        "Create your account and start to share or discovery new ideias",
    },
  ];
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  const fileToUpload = formData.get("file-to-upload");
  const description = formData.get("description");
  const mixedName = formData.get("mixed-name");

  if (typeof fileToUpload !== "string")
    return json({
      errors: {
        image: "Image is required",
        description: null,
        mixedName: null,
      },
    });

  if (typeof description !== "string") {
    return json({
      errors: {
        image: null,
        description: "A simple description is required",
        mixedName: null,
      },
    });
  }

  if (typeof mixedName !== "string") {
    return json({
      errors: {
        image: null,
        description: null,
        mixedName: "A image name is required",
      },
    });
  }

  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    return redirect("/");
  }

  const previewURL = cloudinary.retrieveImageURL(fileToUpload, {
    transformation: {
      width: 300,
      height: 300,
    },
  });

  const image = cloudinary.retrieveImageURL(fileToUpload, {
    width: 700,
    height: 600,
    quality: 100,
  });

  const originalURL = cloudinary.retrieveImageURL(fileToUpload);

  await API.IMAGE.save({
    userId: user?.id,
    content: "image",
    URL: image,
    previewURL,
    originalURL,
    slug: previewURL,
    description,
    name: mixedName,
  });

  return json(
    {
      errors: {
        image: null,
        description: null,
        mixedName: null,
      },
    },
    { status: 201 }
  );
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user) {
    return redirect("/");
  }
  return {};
};

export default function Upload() {
  const actionResult = useActionData<typeof action>();
  const navigation = useNavigation();
  const uploadRef = useRef<HTMLFormElement>(null);
  const toast = useToast();

  const isActionSubmission = navigation.state === "submitting";

  useEffect(() => {
    if (!actionResult) return;
    const uploadSuccess = Object.values(actionResult?.errors ?? {}).every(
      (value) => !value
    );

    if (uploadSuccess) {
      uploadRef.current?.reset();
      setPreviewImage(null);
      toast.addToast({
        title: "Upload succesfully",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionResult]);

  const [previewImage, setPreviewImage] = useState<File | null>(null);

  return (
    <>
      <main className="h-full bg-blue-200 flex items-center justify-center p-2">
        <section className="p-6 bg-white rounded-md shadow-lg w-full max-w-5xl h-full md:max-h-[70vh]">
          <div className="h-full flex flex-col">
            <h1 className="text-3xl font-medium pb-4 border-b mb-2 border-slate-400">
              Upload your image
            </h1>
            <Form
              ref={uploadRef}
              method="post"
              encType="multipart/form-data"
              className="flex flex-col md:flex-row gap-3 flex-1"
            >
              <div className="w-full h-full p-5">
                <h3 className="text-lg font-medium">Preview </h3>
                <img
                  alt="preview"
                  className="shadow-lg mt-5 h-[300px] md:h-[450px] w-full aspect-auto"
                  src={
                    previewImage
                      ? URL.createObjectURL(new Blob([previewImage]))
                      : "https://as2.ftcdn.net/v2/jpg/02/51/95/53/1000_F_251955356_FAQH0U1y1TZw3ZcdPGybwUkH90a3VAhb.jpg"
                  }
                />
              </div>
              <div className="border border-solid border-slate-200" />
              <div className="w-full h-full p-5">
                <div className="flex w-full items-center justify-center bg-grey-lighter">
                  <label className="w-full flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide border border-blue cursor-pointer hover:bg-blue hover:opacity-90">
                    <svg
                      className="w-8 h-8"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
                    </svg>
                    <span className="mt-2 text-md">Select a file</span>
                    <input
                      type="file"
                      className="hidden"
                      name="file-to-upload"
                      id="file-to-upload"
                      multiple={false}
                      onChange={(event) =>
                        setPreviewImage(Array.from(event.target.files ?? [])[0])
                      }
                    />
                  </label>
                </div>
                <div className="my-3">
                  <label htmlFor="email" className="text-sm">
                    Mixed name
                  </label>
                  <input
                    type="text"
                    required
                    name="mixed-name"
                    className="w-full border text-md border-slate-300 p-2 mt-1 rounded-md outline-none hover:border-slate-600 transition-all"
                    id="mixed-name"
                  />
                </div>
                <div className="my-3">
                  <label htmlFor="email" className="text-sm">
                    Simple description
                  </label>
                  <input
                    type="text"
                    required
                    name="description"
                    className="w-full border text-md border-slate-300 p-2 mt-1 rounded-md outline-none hover:border-slate-600 transition-all"
                    id="description"
                  />
                </div>
                {Object.values(actionResult?.errors ?? {}).map((error) => {
                  if (error) return <p>{error}</p>;
                  return null;
                })}
                <button
                  disabled={isActionSubmission}
                  type="submit"
                  className="mt-5 p-2 bg-green-600 text-white w-full rounded-sm disabled:bg-slate-100 disabled:text-gray-400"
                >
                  Send image
                </button>
              </div>
            </Form>
          </div>
        </section>
      </main>
      <toast.ToastComponent />
    </>
  );
}

export const ErrorBoundary = () => <h3>Whoops!</h3>;

export const CatchBoundary = () => <h3>Not found!</h3>;
