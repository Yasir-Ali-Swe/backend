import userInfoModel from "../models/user-info-model.js";
import userBaseModel from "../models/user-base-model.js";

export const createClientProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { dob, city, province, country, profileImageUrl } = req.body;
    if (!userId || !dob || !city || !province) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const newUserProfile = new userInfoModel({
      userId,
      dob,
      city,
      province,
      country,
      profileImageUrl,
    });
    const userBase = await userBaseModel.findById(userId);
    if (!userBase) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    userBase.isProfileComplete = true;
    await userBase.save();
    const savedProfile = await newUserProfile.save();
    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: savedProfile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getClientProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const userProfile = await userInfoModel
      .findOne({ userId })
      .populate("userId", "-password");
    if (!userProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }
    res.status(200).json({ success: true, clientProfile: userProfile });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const updateClientProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { dob, city, province, profileImageUrl } = req.body;
    if (!userId || !dob || !city || !province) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const userProfile = await userInfoModel.findOne({ userId });
    if (!userProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    }
    if (dob) userProfile.dob = dob;
    if (city) userProfile.city = city;
    if (province) userProfile.province = province;
    if (profileImageUrl) userProfile.profileImageUrl = profileImageUrl;
    const updatedProfile = await userProfile.save();
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
