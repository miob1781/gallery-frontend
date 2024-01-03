import React, { Dispatch, SetStateAction, createContext, useEffect, useState } from "react";
import { getImages, postImage } from "../requests/requests.ts";
import { Image } from "../types/types.ts";

interface Props {
  setCloudinaryId: Dispatch<SetStateAction<string>>;
  setImages: Dispatch<SetStateAction<Image[]>>;
}

const CLOUD_NAME: string = process.env.REACT_APP_CLOUD_NAME!;
const UPLOAD_PRESET: string = process.env.REACT_APP_UPLOAD_PRESET!;
const uwConfig = {
  cloudName: CLOUD_NAME,
  uploadPreset: UPLOAD_PRESET
};

// Create a context to manage the script loading state
const CloudinaryScriptContext = createContext({});

function CloudinaryUploadWidget({ setCloudinaryId, setImages }: Props) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Check if the script is already loaded
    if (!loaded) {
      const uwScript = document.getElementById("uw");
      if (!uwScript) {
        // If not loaded, create and load the script
        const script = document.createElement("script");
        script.setAttribute("async", "");
        script.setAttribute("id", "uw");
        script.src = "https://upload-widget.cloudinary.com/global/all.js";
        script.addEventListener("load", () => setLoaded(true));
        document.body.appendChild(script);
      } else {
        // If already loaded, update the state
        setLoaded(true);
      }
    }
  }, [loaded]);

  const initializeCloudinaryWidget = () => {
    if (loaded) {
      var myWidget = window.cloudinary.createUploadWidget(
        uwConfig,
        async (error, result) => {
          if (!error && result && result.event === "success") {
            console.log(result);
            const cloudinaryId: string = result.info.public_id;
            const error = await postImage(cloudinaryId);
            if (!error) {
              setCloudinaryId(cloudinaryId);
              setImages(prev => [...prev, {
                id: '',
                cloudinaryId,
                title: '',
                tags: []
              }]);
            }
          }
        }
      );

      document.getElementById("upload_widget")!.addEventListener(
        "click",
        function () {
          myWidget.open();
        },
        false
      );
    }
  };

  return (
    <CloudinaryScriptContext.Provider value={{ loaded }}>
      <button
        id="upload_widget"
        className="cloudinary-button"
        onClick={initializeCloudinaryWidget}
      >
        Upload
      </button>
    </CloudinaryScriptContext.Provider>
  );
}

export default CloudinaryUploadWidget;
export { CloudinaryScriptContext };
