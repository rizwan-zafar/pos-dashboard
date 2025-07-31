import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";

const VideoUploader = ({ setVideoUrl, videoUrl }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // const uploadUrl = "http://localhost:5055/uploads/videos";
    const uploadUrl = process.env.REACT_APP_IMAGE_UPLOAD_URL;


  const { getRootProps, getInputProps } = useDropzone({
    accept: "video/*",
    multiple: false,
    maxSize: 50000000, // Max size: 50 MB
    onDrop: (acceptedFiles) => {
      setErrorMessage("");
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  useEffect(() => {
    if (files.length > 0) {
      const uploadFile = async (file) => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
          const response = await axios.post(uploadUrl, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          setVideoUrl(response.data.images[0]); 
          setErrorMessage("");
        } catch (error) {
          setErrorMessage(
            error.response?.data?.error || "Failed to upload video. Try again."
          );
        } finally {
          setIsLoading(false);
        }
      };

      files.forEach(uploadFile);
    }

    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    };
  }, [files, uploadUrl, setVideoUrl]);

  return (
    <div className="w-full text-center">
      <div
        className="px-6 pt-5 pb-6 border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <span className="mx-auto flex justify-center">
          <FiUploadCloud className="text-3xl base-color" />
        </span>
        <p className="text-sm mt-2">Drag your video here</p>
        <em className="text-xs text-gray-400">
          (Only *.mp4,  *.avi videos will be accepted)
        </em>
      </div>
      {errorMessage && (
        <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
      )}
      <aside className="flex flex-row flex-wrap mt-4">
        {isLoading ? (
          <div className="flex items-center justify-center w-48 h-48 border rounded-md border-gray-300">
            <span className="text-sm text-gray-500">Uploading...</span>
          </div>
        ) : (
          videoUrl && (
            <video
              className="inline-flex border rounded-md border-gray-100 dark:border-gray-600 w-48 max-h-48 p-2"
              src={videoUrl}
              controls
              autoPlay
              loop
              // crossOrigin="anonymous" 
            />
          )
        )}
      </aside>
    </div>
  );
};

export default VideoUploader;
