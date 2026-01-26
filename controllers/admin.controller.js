import profileModel from "../models/user.profile.model.js";
import userModel from "../models/user.model.js";
import courtModel from "../models/court.model.js";
import userProfileModel from "../models/user.profile.model.js";
import clerkProfile from "../models/clerk.model.js";

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

export const adminCreateCourt = async (req, res) => {
  try {
    const createdBy = req.userId;
    const { name, city, province, type } = req.body;
    if (!name || !city || !province || !type) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const newCourt = new courtModel({
      name,
      city,
      province,
      type,
      createdBy,
    });
    await newCourt.save();
    res.status(201).json({ message: "Court created successfully." });
  } catch (error) {
    console.log(
      "Internal Server Error in admin create court controller",
      error.message,
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllCourts = async (req, res) => {
  try {
    const courts = await courtModel
      .find()
      .populate("createdBy", "fullName email role");
    if (courts.length === 0) {
      return res.status(404).json({ message: "No courts found." });
    }
    res.status(200).json({ courts });
  } catch (error) {
    console.log(
      "Internal Server Error in get all courts controller",
      error.message,
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const adminGetCourtById = async (req, res) => {
  try {
    const courtId = req.params.id;
    if (!courtId) {
      return res.status(400).json({ message: "Court ID is required." });
    }
    const court = await courtModel
      .findById(courtId)
      .populate("createdBy", "fullName email role");
    if (!court) {
      return res.status(404).json({ message: "Court not found." });
    }
    res.status(200).json({ court });
  } catch (error) {
    console.log(
      "Internal Server Error in admin get court by id controller",
      error.message,
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const adminCreateInternalUsers = async (req, res) => {
  try {
    const { fullName, email, password, dob, city, province, role } = req.body;

    if (
      !fullName ||
      !email ||
      !password ||
      !dob ||
      !city ||
      !province ||
      !role
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use." });
    }

    const newClerk = await userModel.create({
      fullName,
      email,
      password,
      role,
      isVerified: true,
    });

    try {
      await userProfileModel.create({
        userId: newClerk._id,
        dob,
        city,
        province,
      });
    } catch (profileError) {
      await userModel.deleteOne({ _id: newClerk._id });
      throw profileError;
    }

    res.status(201).json({ message: "Internal user created successfully." });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const adminGetInternalUsers = async (req, res) => {
  try {
    const { role } = req.query;
    const allowedRoles = ["clerk", "court_officer"];
    let roleFilter;
    if (role) {
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({ message: "Invalid role." });
      }
      roleFilter = role;
    } else {
      roleFilter = { $in: allowedRoles };
    }
    const internalUsers = await userModel.find({ role: roleFilter });
    const internalUsersWithProfiles = await Promise.all(
      internalUsers.map(async (user) => {
        const profile = await profileModel.findOne({ userId: user._id });
        return {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          isProfileComplete: user.isProfileComplete,
          profile: profile
            ? {
                dob: profile.dob,
                city: profile.city,
                province: profile.province,
                profileImage: profile.profileImage,
              }
            : null,
        };
      }),
    );
    res.status(200).json({ internalUsers: internalUsersWithProfiles });
  } catch (error) {
    console.log("Error in Admin get internal users", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const adminGetInternalUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const user = await userProfileModel
      .findOne({ userId: id })
      .populate("userId", "fullName email role isVerified isProfileComplete");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.log("Error in Admin get internal user by id", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const adminAssigneClerkToCourt = async (req, res) => {
  try {
    const { clerkId, courtId } = req.body;
    if (!clerkId || !courtId) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const userProfile = await userProfileModel.findOne({ userId: clerkId });
    if (!userProfile) {
      return res.status(404).json({ message: " Clerk profile not found" });
    }
    const court = await courtModel.findById(courtId);
    if (!court) {
      return res.status(404).json({ message: "Court not found" });
    }
    const clerkCourtProfile = await clerkProfile.findOne({
      clerkProfile: userProfile._id,
    });
    if (clerkCourtProfile) {
      return res
        .status(409)
        .json({ message: "Clerk is already assigned to a court." });
    }
    const newClerkProfile = new clerkProfile({
      userId: clerkId,
      courtId: court._id,
      clerkProfile: userProfile._id,
      designation: "Clerk",
    });
    await newClerkProfile.save();
    court.clerkId = clerkId;
    await court.save();
    res.status(200).json({
      message: "Clerk assigned to court successfully.",
      newClerkProfile,
    });
  } catch (error) {
    console.log("Error in Admin assigne clerk to court", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const adminGetClerkProfiles = async (req, res) => {
  try {
    const { clerkId } = req.params;
    if (!clerkId) {
      return res.status(400).json({ message: "Clerk ID is required." });
    }

    const clerk = await clerkProfile
      .findOne({ userId: clerkId })
      .populate("userId")
      .populate("courtId")
      .populate("clerkProfile");

    if (!clerk) {
      return res.status(404).json({ message: "Clerk profile not found." });
    }

    res.status(200).json({ clerk });
  } catch (error) {
    console.log("Error in Admin get clerk profile", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const adminGetClerkProfile = async (req, res) => {
  try {
    const clerkProfiles = await clerkProfile
      .find()
      .populate("userId")
      .populate("courtId")
      .populate("clerkProfile");
    res.status(200).json({ clerkProfiles });
  } catch (error) {
    console.log("Error in Admin get clerk profile", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
