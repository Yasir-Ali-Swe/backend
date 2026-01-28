import messageModel from "../models/message-model.js";
import conversationModel from "../models/conversation-model.js";
import userModel from "../models/user-base-model.js";


export const createMessage = async (req, res) => {
  try {
    const senderId = req.userId.toString();
    const role = req.userRole;

    const { conversationId, content, receiverId } = req.body;

    if (!content || !receiverId) {
      return res.status(400).json({
        success: false,
        message: "receiverId and content are required",
      });
    }

    let conversation = null;

    if (conversationId) {
      conversation = await conversationModel.findById(conversationId);

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found",
        });
      }
    } else {
      const clientId = role === "client" ? senderId : receiverId;
      const lawyerId = role === "lawyer" ? senderId : receiverId;

      conversation = await conversationModel.findOne({
        clientId,
        lawyerId,
      });

      if (!conversation) {
        conversation = await conversationModel.create({
          clientId,
          lawyerId,
        });
      }
    }

    // Participant validation (always)
    const isParticipant =
      conversation.clientId.toString() === senderId ||
      conversation.lawyerId.toString() === senderId;

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this conversation",
      });
    }

    const newMessage = await messageModel.create({
      conversationId: conversation._id,
      senderId,
      senderRole: role,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    // Duplicate conversation edge case safety
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Conversation already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMessagesByConversation = async (req, res) => {
  try {
    const userId = req.userId.toString();
    const { conversationId } = req.params;

    const conversation = await conversationModel.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    const isParticipant =
      conversation.clientId.toString() === userId ||
      conversation.lawyerId.toString() === userId;

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const messages = await messageModel
      .find({ conversationId })
      .sort({ createdAt: 1 }); // oldest → newest

    return res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getConversations = async (req, res) => {
  try {
    const userId = req.userId.toString();

    // Step 1: find all conversations where user is a participant
    const conversations = await conversationModel
      .find({
        $or: [{ clientId: userId }, { lawyerId: userId }],
      })
      .sort({ updatedAt: -1 }) // latest conversation first
      .lean();

    // Step 2: map to include last message, unread count, and other user info
    const results = await Promise.all(
      conversations.map(async (conv) => {
        const lastMessage = await messageModel
          .findOne({ conversationId: conv._id })
          .sort({ createdAt: -1 })
          .lean();

        const unreadCount = await messageModel.countDocuments({
          conversationId: conv._id,
          senderId: { $ne: userId },
          seen: false,
        });

        // Determine the other participant
        const otherUserId =
          conv.clientId.toString() === userId
            ? conv.lawyerId
            : conv.clientId;

        const otherUser = await userModel.findById(otherUserId).select(
          "fullName email avatar"
        );

        return {
          conversationId: conv._id,
          withUser: otherUser,
          lastMessage: lastMessage ? lastMessage.content : null,
          lastMessageAt: lastMessage ? lastMessage.createdAt : conv.createdAt,
          unreadCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
