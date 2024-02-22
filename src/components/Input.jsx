import { useState, useEffect } from "react";

async function query(data) {
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
  const result = await response.blob();
  return result;
}

const Input = () => {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [blob, setBlob] = useState(null);
  const [disability, setDisability] = useState(false);

  useEffect(() => {
    if (blob) {
      let reader = new FileReader();
      const promptCopy = prompt;
      reader.onload = function (e) {
        let src = e.target.result;
        setMessages((prevMessages) => [
          ...prevMessages,
          { prompt: promptCopy, src: src },
        ]);
        setDisability(false); // Set disability to false after setting the messages
      };
      reader.readAsDataURL(blob);
    }
  }, [blob]);

  function submit(input) {
    query({ inputs: input }).then((response) => {
      setBlob(response);
      setDisability(true); // Disable input while fetching
    });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="max-h-[80%] gap-3 flex flex-col pt-4 overflow-y-scroll">
        {messages.map((msg, index) => (
          <div key={index} className="flex flex-col">
            <p>{msg.prompt}</p>
            {msg.src ? (
              <img className="md:w-[40%]" src={msg.src} alt="Generated" />
            ) : (
              <p>Loading...</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-row gap-3">
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
          className="main-grad text-white px-5 rounded-lg"
          onClick={() => {
            if (prompt.trim() !== "") {
              submit(prompt);
            } else {
              alert("Enter a prompt");
            }
          }}
        >
          Compute
        </button>
      </div>
    </div>
  );
};

export default Input;
