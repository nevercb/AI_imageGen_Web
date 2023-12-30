import express from "express";
import "dotenv/config";
import OpenAI from "openai";
const router = express.Router();
//https://github.com/openai/openai-node/discussions/217
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is also the default, can be omitted
  baseURL:
    "https://gateway.ai.cloudflare.com/v1/4348855cb905d4842150085d35281bdd/ai-gateway/openai",
  //添加代理
});

router.route("/").get((req, res) => {
  res.send("Hello from DALL-E!");
});

router.route("/").post(async (req, res) => {
  try {
    const { prompt } = req.body;
    const aiResponse = await openai.images.generate({
      prompt,
      n: 1,
      size: "1024x1024",
      response_format: "b64_json",
    });
    const image = aiResponse.data[0].b64_json;

    res.status(200).json({ photo: image });
  } catch (err) {
    console.log(err);
    res.status(500).send(err?.response.data.err.message);
  }
});
export default router;
