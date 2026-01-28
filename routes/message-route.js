import {
  createMessage,
  getMessagesByConversation,
  getConversations,
} from "../controllers/message-controller.js";
import { lawyerClientMiddleware } from "../middlewares/lawyer-client-middleware.js";
import express from "express";

const router = express.Router();

router.post("/create-message", lawyerClientMiddleware, createMessage);
router.get(
  "/get-messages-history/:conversationId",
  lawyerClientMiddleware,
  getMessagesByConversation,
);
router.get("/get-conversations", lawyerClientMiddleware, getConversations);

export default router;
