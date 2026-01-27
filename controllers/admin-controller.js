import userInfo from "../models/user-info-model.js";
import userBase from "../models/user-base-model.js";
import courtModel from "../models/court-model.js";
import clerkProfileModel from "../models/clerk-profile-model.js";

export const createProfile = async (req, res) => {
    try {
        const userId = req.userId;
        console.log(userId);
        const { dob, city, province, profileImageUrl } = req.body;
        if (!userId || !dob || !city || !province) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const adminProfile = new userInfo({
            userId,
            dob,
            city,
            province,
            profileImageUrl
        })
        const savedProfile = await adminProfile.save();
        return res.status(200).json({
            success: true,
            message: "Profile created successfully",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating profile",
            error: error
        })
    }
}

export const adminUpdateHisProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const { dob, city, province, profileImageUrl } = req.body;
        if (!userId) {
            res.status(400).json({
                success: false,
                message: "User ID is required"
            })
        }
        const updatedProfile = await userInfo.findOneAndUpdate({ userId }, { $set: { dob, city, province, profileImageUrl } }, { new: true })
        if (!updatedProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            updatedProfile
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating profile",
            error: error
        })
    }
}

export const adminGetHisProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const profile = await userInfo.findOne({ userId }).populate("userId", "fullName email role")
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            profile
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting profile",
            error: error
        })
    }
}


export const adminCreateCourt = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, type, city, province } = req.body;
        if (!userId || !name || !type || !city || !province) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }

        const newCourt = new courtModel({
            name,
            type,
            city,
            province,
            createdBy: userId
        })

        await newCourt.save();

        return res.status(201).json({
            success: true,
            message: "Court created successfully",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating court",
            error: error
        })
    }
}


export const getAllCourts = async (req, res) => {
    try {
        const userId = req.userId;
        const courts = await courtModel.find({ createdBy: userId }).populate("createdBy", "fullName email role")
        if (courts.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Courts not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Courts fetched successfully",
            courts
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting courts",
            error: error
        })
    }
}


export const getCourtById = async (req, res) => {
    try {
        const userId = req.userId;
        const courtId = req.params.courtId;
        const court = await courtModel.findOne({ createdBy: userId, _id: courtId }).populate("createdBy", "fullName email role")
        if (!court) {
            return res.status(404).json({
                success: false,
                message: "Court not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Court fetched successfully",
            court
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error getting court",
            error: error
        })
    }
}


export const adminCreateInternalUser = async (req, res) => {
    try {
        const { fullName, email, password, dob, city, province, role } = req.body;
        if (!fullName || !email || !password || !dob || !city || !province || !role) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            })
        }
        const userExist = await userBase.findOne({ email })
        if (userExist) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        const clerk = new userBase({
            fullName,
            email,
            password,
            isVerified: true,
            isProfileComplete: true,
            role
        })
        await clerk.save();
        const clerkProfile = new userInfo({
            userId: clerk._id,
            dob,
            city,
            province,
        })
        await clerkProfile.save();
        return res.status(201).json({
            success: true,
            message: "Clerk created successfully",
        })



    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating clerk",
            error: error
        })
    }
}

export const adminGetAllInternalUsers = async (req, res) => {
    try {
        const role = req.query.role;
        const allowedRoles = ["clerk", "court_officer"];

        // If role is provided, validate it
        if (role && !allowedRoles.includes(role)) {
            return res.status(400).json({ success: false, message: "Invalid role" });
        }

        // Build query
        const query = role ? { role } : { role: { $in: allowedRoles } };

        const internalUsers = await userBase.find(query);

        if (internalUsers.length === 0) {
            return res.status(404).json({ success: false, message: "No internal users found" });
        }

        // Fetch profiles
        const internalUserProfiles = await Promise.all(
            internalUsers.map(async (internalUser) => {
                const profile = await userInfo
                    .findOne({ userId: internalUser._id })
                    .populate("userId", "fullName email role");

                return {
                    ...internalUser.toObject(),
                    profile: profile || null,
                };
            })
        );

        return res.status(200).json({
            success: true,
            message: "Internal users fetched successfully",
            data: internalUserProfiles,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error getting all internal users",
            error: error.message,
        });
    }
};



export const adminGetInternalUserById = async (req, res) => {
    try {
        const { internalUserId } = req.params;
        const internalUser = await userBase.findOne({ _id: internalUserId, role: { $in: ["clerk", "court_officer"] } });
        if (!internalUser) {
            return res.status(404).json({ success: false, message: "Internal user not found" });
        }
        const profile = await userInfo
            .findOne({ userId: internalUser._id })
            .populate("userId", "fullName email role");

        return res.status(200).json({
            success: true,
            message: "Internal user fetched successfully",
            internalUser: {
                ...internalUser.toObject(),
                profile: profile || null,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error getting internal user by id", error: error });
    }
}


export const adminAssigneClerkToCourt = async (req, res) => {
    try {
        const { clerkId, courtId } = req.body;
        const clerk = await userBase.findOne({ _id: clerkId, role: "clerk" });
        const court = await courtModel.findOne({ _id: courtId });
        if (!clerk) {
            return res.status(404).json({ success: false, message: "Clerk  not found" });
        }
        if (!court) {
            return res.status(404).json({ success: false, message: "Court not found" });
        }

        const clerkProfile = await clerkProfileModel.findOne({ userId: clerkId });
        if (clerkProfile) {
            return res.status(404).json({ success: false, message: "Clerk already assigned to court" });
        }

        const clerkInfoId = await userInfo.findOne({ userId: clerkId })
        if (!clerkInfoId) {
            return res.status(404).json({ success: false, message: "Clerk info not found" });
        }

        court.clerkId = clerkId;
        await court.save();

        const newClerkProfile = new clerkProfileModel({
            userId: clerkId,
            courtId: courtId,
            clerkProfileId: clerkInfoId._id,
            designation: "Clerk",
        })
        await newClerkProfile.save();
        return res.status(200).json({ success: true, message: "Clerk assigned to court successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error assigning clerk to court", error: error })
    }
}

export const getClerkProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User id is required" })
        }
        const clerkProfile = await clerkProfileModel.findOne({ userId: userId }).populate("userId", "fullName email role").populate("courtId", "name type city province").populate("clerkProfileId", "dob city province");
        if (!clerkProfile) {
            return res.status(404).json({ success: false, message: "Clerk profile not found" })
        }
        return res.status(200).json({ success: true, message: "Clerk profile fetched successfully", clerkProfile })
    } catch (error) {
        res.status(500).json({ success: false, message: "Error getting clerk profile", error: error })
    }
}   