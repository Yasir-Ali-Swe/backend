import userBaseModel from "../models/user-base-model.js";
import lawyerProfileModel from "../models/lawyer-profile-model.js";
import UserInfoModel from "../models/user-info-model.js";
import proposalModel from "../models/proposal-model.js";

export const createLawyerInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const { dob, city, province, profileImageUrl } = req.body;
    const user = await userBaseModel.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const userInfo = new UserInfoModel({
      userId,
      dob,
      city,
      province,
      profileImageUrl,
    });
    await userInfo.save();
    res.status(201).json({
      success: true,
      message: "User info created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getLawyerInfo = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }
    const lawyerInfo = await UserInfoModel.findOne({ userId }).populate(
      "userId",
      "name email role isVerified isProfileComplete",
    );
    if (!lawyerInfo) {
      return res
        .status(404)
        .json({ success: false, message: "Lawyer info not found" });
    }
    res.status(200).json({
      success: true,
      message: "Lawyer info fetched successfully",
      data: lawyerInfo,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const updateLawyerInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const { dob, city, province, profileImageUrl } = req.body;

    const lawyerInfo = await UserInfoModel.findOne({ userId });
    if (!lawyerInfo) {
      return res
        .status(404)
        .json({ success: false, message: "Lawyer info not found" });
    }

    lawyerInfo.dob = dob || lawyerInfo.dob;
    lawyerInfo.city = city || lawyerInfo.city;
    lawyerInfo.province = province || lawyerInfo.province;
    lawyerInfo.profileImageUrl = profileImageUrl || lawyerInfo.profileImageUrl;

    await lawyerInfo.save();

    res.status(200).json({
      success: true,
      message: "Lawyer info updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const createLawyerProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { experience, specialization, barCouncil } = req.body;
    if (!userId || !experience || !specialization || !barCouncil) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields are required" });
    }
    const lawyerInfo = await UserInfoModel.findOne({ userId });
    if (!lawyerInfo) {
      return res.status(404).json({
        success: false,
        message:
          "Please first Complete the lawyer contact information then proceed",
      });
    }
    const lawyerProfile = new lawyerProfileModel({
      userId,
      experience,
      specialization,
      barCouncil,
      lawyerProfileId: lawyerInfo._id,
    });
    if (await lawyerProfile.save()) {
      const user = await userBaseModel.findById(userId);
      user.isProfileComplete = true;
      await user.save();
    }
    res.status(201).json({
      success: true,
      message: "Lawyer Profile created successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getLawyerProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }
    const lawyerProfile = await lawyerProfileModel
      .findOne({ userId })
      .populate("userId", "name email role isVerified isProfileComplete")
      .populate("lawyerProfileId", " dob city province profileImageUrl");
    if (!lawyerProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Lawyer profile not found" });
    }
    res.status(200).json({
      success: true,
      message: "Lawyer profile fetched successfully",
      data: lawyerProfile,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const updateLawyerProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { experience, specialization, barCouncil } = req.body;

    const lawyerProfile = await lawyerProfileModel.findOne({ userId });
    if (!lawyerProfile) {
      return res
        .status(404)
        .json({ success: false, message: "Lawyer profile not found" });
    }

    lawyerProfile.experience = experience || lawyerProfile.experience;
    lawyerProfile.specialization =
      specialization || lawyerProfile.specialization;
    lawyerProfile.barCouncil = barCouncil || lawyerProfile.barCouncil;

    await lawyerProfile.save();

    res.status(200).json({
      success: true,
      message: "Lawyer profile updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const updateProposalStatus = async (req, res) => {
  try {
    const { proposalId, status } = req.body;
    const lawyerId = req.userId.toString();

    if (!proposalId || !status) {
      return res.status(400).json({
        success: false,
        message: "Proposal ID and status are required",
      });
    }

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'accepted' or 'rejected'",
      });
    }

    const proposal = await proposalModel.findById(proposalId);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: "Proposal not found",
      });
    }

    if (proposal.lawyerId.toString() !== lawyerId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this proposal",
      });
    }

    proposal.status = status;
    const updatedProposal = await proposal.save();

    res.status(200).json({
      success: true,
      message: `Proposal ${status} successfully`
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};


export const getLawyerProposals = async (req, res) => {
  try {
    const lawyerId = req.userId;
    const { status } = req.query;


    if (!lawyerId) {
      return res.status(400).json({
        success: false,
        message: "Lawyer ID is required",
      });
    }
    const query = { lawyerId };
    if (status) {
      query.status = status;
    }

    const proposals = await proposalModel
      .find(query)
      .populate("clientId", "fullName email")
      .sort({ createdAt: -1 });

    if (!proposals || proposals.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No proposals found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Proposals fetched successfully",
      data: proposals,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

