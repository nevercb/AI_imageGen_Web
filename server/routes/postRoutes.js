import express from "express";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

import Post from "../mongodb/modules/post.js";

dotenv.config();

const router = express.Router();
// https://cloudinary.com/documentation/node_quickstart
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET ALL POSTS
router.route("/").get(async (req, res) => {
  try {
    const posts = await Post.find({});
    res.status(200).json({ ok: true, data: posts });
  } catch (err) {
    res.status(500).json({ ok: false, message: err });
  }
});

router.route("/").post(async (req, res) => {
  try {
    const { name, prompt, photo } = req.body;
    console.log(req.body);
    const photoUrl = await cloudinary.uploader.upload(photo);

    const newPost = await Post.create({
      name,
      prompt,
      photo: photoUrl.url,
    });

    res.status(201).json({ ok: true, data: newPost });
  } catch (err) {
    console.log(err);
    res.status(500).json({ ok: false, message: err });
  }
});
// CREAT A POST

export default router;
