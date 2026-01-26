import profileModel from "../models/user.profile.model.js";
import userModel from "../models/user.model.js";

export const adminCompleteProfile = async (req, res) => {
  try {
    const { dob, city, province, profileImage } = req.body;
    const userId = req.userId;

    // Validate required fields
    if (!dob || !city || !province || !userId) {
      return res.status(400).json({ message: "All Fields are required." });
    }

    // Create new profile document
    const newProfile = new profileModel({
      userId,
      dob,
      city,
      province,
      profileImage,
    });

    // Save profile to database
    const userExist = await userModel.findById(userId);
    if (userExist) {
      userExist.isProfileComplete = true;
      await newProfile.save();
      await userExist.save();
    }
    res.status(201).json({ message: "Profile completed successfully." });
  } catch (error) {
    console.error("Error completing admin profile:", error.message);
    res.status(error.status || 500).json({ message: "Internal Server Error" });
  }
};

export const getAdminProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userProfile = await profileModel
      .findOne({ userId })
      .populate("userId", "fullName email role isVerified isProfileComplete");
    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }
    return res.status(200).json({ profile: userProfile });
  } catch (error) {
    console.log("Error in get admin profile controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { dob, city, province, profileImage } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userProfile = await profileModel.findOne({ userId });
    if (!userProfile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    // Update profile fields
    if (dob) userProfile.dob = dob;
    if (city) userProfile.city = city;
    if (province) userProfile.province = province;
    if (profileImage) userProfile.profileImage = profileImage;
    await userProfile.save();

    return res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.log(
      "Internal Server Error in update admin profile controller",
      error.message,
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};
