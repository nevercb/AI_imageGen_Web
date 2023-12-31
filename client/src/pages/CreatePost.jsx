import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { preview } from "../assets";
import { getRandomPrompts } from "../utils";
import { FormField, Load } from "../components";
const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    prompt: "",
    photo: "",
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (form.prompt) {
      try {
        setGeneratingImg(true);
        const response = await fetch(
          "https://nevercb-imggen.onrender.com/api/v1/dalle",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: form.prompt }),
          }
        );
        const data = await response.json();
        setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        alert(err);
      } finally {
        setGeneratingImg(false);
      }
    } else {
      alert("Please enter a prompt");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch(
          "https://nevercb-imggen.onrender.com/api/v1/post",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          }
        );
        await response.json();
        navigate("/");
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please enter a prompt and a generated photo");
    }
  };
  const handleChange = (e) => {
    console.log(e);
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompts(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };
  return (
    <section className="max-w-7x1 mx-auto">
      <div>
        <h1 className="font-serif font-extrabold text-[#2222328] text-[32px]">
          Create
        </h1>
        <p
          className="mt-2 text-[#666e75] text-[14px]
          max-w[500px]"
        >
          输入您的用户名和指令后，点击generate按钮生成一张AI图片，可点击share按钮将其分享至社区或再次生成
        </p>
      </div>
      <form className="mt-16 max-w-3x1" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your name (用户名) "
            type="text"
            name="name"
            placeholder="ljj"
            value={form.name}
            handleChange={handleChange}
          />
          <FormField
            labelName="Prompt (指令)"
            type="text"
            name="prompt"
            placeholder="一张美丽的江南景观图"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />
          <div
            className="relative
          bg-gray-50 border border-gray-300
          text-sm rounded-lg
          focus:ring-blue-500
          focus:border-blue-500
          w-64
          p-3
          h-64
          flex
          justify-center
          items-center
          shadow-lg
          shadow-cyan-900
          "
          >
            {form.photo ? (
              <img
                src={form.photo}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain
                    opacity-40"
              />
            )}

            {generatingImg && (
              <div
                className="absolute
              inset-0 z-0 flex justify-center
              items-center bg-[rgba(0,0,0,0.5)] rounded-lg"
              >
                <Load />
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className="text-white bg-lime-500 font-medium
          rounded-md text-sm w-full sm:w-auto px-4 py-2
          text-center my-3 shadow-lime-300 shadow-md
          hover:bg-lime-300"
          >
            {generatingImg ? "Generating..." : "Generate"}
          </button>
        </div>

        <div className="mt-3">
          <p className="mt-2 font-serif text-[#666e75] text-[14px]">
            {" "}
            如果对图片不满意可以再次点击generate,
            若您满意可选择将图片发布至社区公开。
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-teal-400
          font-medium rounded-md text-sm w-full
          sm:w-auto 
          px-5
          py-2.5
          text-center
          hover:bg-teal-300
          shadow-md
          shadow-teal-200"
          >
            {loading ? "Sharing..." : "Share with the community"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost;
