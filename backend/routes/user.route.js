import express from 'express';
import { fetchUser } from '../middlewares/fetchUser.middleware.js';
import { User } from '../models/user.model.js';
import { upload } from '../middlewares/multer.middleware.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';



const router = express.Router();

router.post('/complete-profile', fetchUser, upload.single('avatar'), async (req, res) => {
  const userId = req.user.id;
  const { targetRole, skillSet, timeCanGive, designation, bio , githubUsername } = req.body;

  if (!targetRole || !skillSet || !timeCanGive || !designation) {
    return res.status(400).send("Incomplete data");
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(401).send("User should login first");

    const update = {
      goal: targetRole,
      time: timeCanGive,
      designation,
      bio,
      isProfileCompleted: true,
      githubUsername,
    };
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        public_id: userId,
        folder: 'avatars',
        overwrite: true,
      });

      update.avatar = result.secure_url;

      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: update,
        $addToSet: {
          skills: { $each: JSON.parse(skillSet) },
        },
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).send("User not found");

    res.json({
      user: updatedUser,
      message: "Profile Updated Successfully"
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

const headers = {
  Authorization: `token ${process.env.GITHUB_SECRET}`,
  'User-Agent': 'SkillMap-App' 
};


router.get('/get-profile', fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId)
    let response = {};
    if (user.avatar) {
      response['avatar'] = user.avatar
    }
    if (user.githubUsername) {
      const githubUrl = await fetchUrl(user.githubUsername)
      const followers = await fetchFollowers(user.githubUsername)
      const projects = await fetchRepos(user.githubUsername)
      response['githubUrl'] = githubUrl
      response['followers'] = followers
      response['projects'] = projects
    }
    if (user.linkedinUrl) {
      response['linkedinUrl'] = user.linkedinUrl
    }
    if (user.twitterUrl) {
      response['twitterUrl'] = user.twitterUrl
    }
    response = {
      ...response,
      username: user.username,
      email: user.email,
      designation: user.designation,
      bio: user.bio,
      skills: user.skills,
      goal: user.goal,
    }
    return res.status(200).json(response)
  }
  catch (error) {
    console.log(error.message)
    return res.status(500).send("Internal Server Error")
  }
})

const fetchUrl = async (username) => {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`,{headers})
    const data = await res.json();
    console.log(data.html_url)
    return data.html_url;
  }
  catch (error) {
    return error.message;
  }
}

const fetchFollowers = async (username) => {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`,{headers})
    const data = await res.json()
    console.log(data.followers)
    return data.followers;
  }
  catch (error) {
    return error.message;
  }
}

const fetchRepos = async (username) => {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos`,{headers})
    const data = await res.json()
    console.log(data.length)
    return data.length;
  }
  catch (error) {
    return error.message;
  }
}

export default router
