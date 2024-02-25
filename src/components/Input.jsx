import { useState, useEffect } from "react";

const Input = () => {
  const [src, setSrc] = useState("");
  const [prompt, setPrompt] = useState("");
  const [blob, setBlob] = useState(null);
  const [disability, setDisability] = useState(false);
  const [error, setError] = useState(null);
  const [imageLoader, setImageLoader] = useState(
    "rendering the image here may take time"
  );

  async function query(data) {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_AI_MODEL}`,
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.blob();

      setImageLoader("rendering the image...");

      return result;
    } catch (error) {
      throw new Error("Error Occured: " + error.message);
    }
  }

  useEffect(() => {
    if (blob) {
      let reader = new FileReader();
      reader.onload = function (e) {
        let src = e.target.result;
        setSrc(src);
        setImageLoader("Image loaded");
        setDisability(false); // Set disability to false after setting the messages
      };
      reader.readAsDataURL(blob);
    }
  }, [blob]);

  function submit(input) {
    setSrc("");
    query({ inputs: input })
      .then((response) => {
        setBlob(response);
        setDisability(true); // Disable input while fetching
        setError(null); // Reset error if any
      })
      .catch((error) => {
        setError(error.message);
      });
    setImageLoader("AI is thinking...");
  }

  // Function to handle image download
  function handleDownload() {
    if (src !== "") {
      const link = document.createElement("a");
      link.href = src;
      link.download = "image.jpg";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  return (
    <div className="flex flex-col h-full">
      {error && <p className="text-red-500">{error}</p>}
      <input
        type="text"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="Cat riding a horse"
        value={prompt}
        disabled={disability}
        onChange={(e) => {
          setPrompt(e.target.value);
        }}
      />
      <button
        type="button"
        className="bg-blue-500 text-white py-2 mt-2 px-5 rounded-lg"
        onClick={() => {
          if (prompt.trim() !== "") {
            submit(prompt);
          } else {
            setError("Enter a prompt");
          }
        }}
      >
        Compute
      </button>

      <p>{imageLoader}</p>

      <div className="h-full mt-5 rounded-lg border-2 border-dashed ">
        <div className="border-b py-1 px-2 flex items-center justify-center gap-4">
          {/* Attach the handleDownload function to the button */}
          <button
            className="hover:bg-slate-50 p-2 flex items-center gap-1 rounded-lg"
            onClick={handleDownload}
          >
            <i className="fa-solid fa-download"></i>
            Download
          </button>
        </div>
        <div className="h-auto p-3 flex items-center justify-center">
          {src !== "" ? (
            <img
              className="lg:w-[50%] aspect-square rounded-lg"
              src={src}
              alt="Rendered Image"
            />
          ) : (
            <p>Image will appear here</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Input;
