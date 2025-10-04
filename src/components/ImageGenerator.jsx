import { useState, useEffect } from "react";
import defaultImage from "../assets/default.webp";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState(defaultImage);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

// generate image function for api call fetching from the .env file 
  async function generateImage(p = null) {
    const currentPrompt = p || prompt;
    if (!currentPrompt) return alert("Please enter a prompt!");

    setLoading(true);

    try {
      const response = await fetch(
        "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_STABILITY_KEY}`,
          },
          body: JSON.stringify({
            text_prompts: [{ text: currentPrompt }],
            cfg_scale: 7,
            height: 1024,
            width: 1024,
            samples: 1,
            steps: 30,
          }),
        }
      );

      const data = await response.json();
      console.log("Stability API Response:", data);

      if (data.artifacts && data.artifacts[0].base64) {
        setImageUrl("data:image/png;base64," + data.artifacts[0].base64);

        // Update history
        setHistory((prev) => [currentPrompt, ...prev.filter((h) => h !== currentPrompt)].slice(0, 3));
      } else {
        console.error("No image returned:", data);
        alert("Failed to generate image. Check console for details.");
      }
    } catch (err) {
      console.error("Error generating image:", err);
      alert("Failed to generate image. Check console for details.");
    }

    setLoading(false);
  }

return (
  <div className="flex flex-col justify-center items-center bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-900 text-white ">
    
    {/* Title */}
    <h1 className="text-4xl md:text-6xl font-extrabold text-center tracking-wide drop-shadow-lg">
      AI Image Generator 🎨
    </h1>

    {/* Input & Generate Button */}
    <div className="flex flex-col md:flex-row gap-4 items-center mt-6 w-full max-w-5xl">
      <input
        type="text"
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="flex-1 p-4 rounded-3xl border border-gray-600 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-lg shadow-inner"
      />
      <button
        onClick={() => generateImage()}
        disabled={loading}
        className="px-8 py-4 rounded-3xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 transition flex items-center justify-center text-lg font-semibold shadow-lg"
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        ) : (
          "Generate"
        )}
      </button>
    </div>

    {/* Prompt History */}
    {history.length > 0 && (
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        {history.map((h, idx) => (
          <button
            key={idx}
            onClick={() => generateImage(h)}
            className="px-4 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-sm transition shadow"
          >
            {h.length > 20 ? h.slice(0, 20) + "..." : h}
          </button>
        ))}
      </div>
    )}

    {/* Image Display */}
    <div className="w-full max-w-6xl flex justify-center items-center mt-6">
      <div className="w-full h-[75vh] bg-gray-800 rounded-3xl shadow-2xl flex justify-center items-center">
        <img
          src={imageUrl}
          alt="Generated"
          className="w-full h-full object-contain rounded-3xl transition-opacity duration-700 ease-in-out"
        />
      </div>
    </div>
  </div>
);



}
