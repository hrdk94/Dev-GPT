import express from "express";

import Conversation from "../models/Conversation.js";
import authMiddleware from "../middleware/auth.js";
import { generateAIResponse } from "../utils/ai.js";

const router = express.Router();


/*
==================================================
SEND MESSAGE
POST /api/chat
==================================================
*/

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { conversationId, message } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                message: "Message is required",
            });
        }

        let conversation;

        /*
        Existing conversation
        */

        if (conversationId) {
            conversation = await Conversation.findOne({
                _id: conversationId,
                userId: req.userId,
            });

            if (!conversation) {
                return res.status(404).json({
                    message: "Conversation not found",
                });
            }
        }

        /*
        Create new conversation
        */

        else {
            conversation = await Conversation.create({
                userId: req.userId,
                title: message.slice(0, 40),
                messages: [],
            });
        }

        /*
        Add user message
        */

        conversation.messages.push({
            role: "user",
            content: message.trim(),
        });

        /*
        Send complete conversation
        to Gemini
        */

        const aiMessages = conversation.messages.map(
            (msg) => ({
                role: msg.role,
                content: msg.content,
            })
        );

        const aiResponse =
            await generateAIResponse(aiMessages);

        /*
        Save AI response
        */

        conversation.messages.push({
            role: "assistant",
            content: aiResponse,
        });

        await conversation.save();

        res.status(200).json({
            conversationId: conversation._id,
            message: aiResponse,
        });

    } catch (error) {
        console.error("Chat error:", error);

        res.status(500).json({
            message:
                "Failed to generate response",
        });
    }
});


/*
==================================================
GET ALL CONVERSATIONS
GET /api/chat
==================================================
*/

router.get("/", authMiddleware, async (req, res) => {
    try {
        const conversations =
            await Conversation.find({
                userId: req.userId,
            })
                .select(
                    "title createdAt updatedAt messages"
                )
                .sort({
                    updatedAt: -1,
                });

        res.json({
            conversations,
        });

    } catch (error) {
        console.error(
            "Get conversations error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to fetch conversations",
        });
    }
});


/*
==================================================
GET SINGLE CONVERSATION
GET /api/chat/:id
==================================================
*/

router.get(
    "/:id",
    authMiddleware,
    async (req, res) => {
        try {
            const conversation =
                await Conversation.findOne({
                    _id: req.params.id,
                    userId: req.userId,
                });

            if (!conversation) {
                return res.status(404).json({
                    message:
                        "Conversation not found",
                });
            }

            res.json({
                conversation,
            });

        } catch (error) {
            console.error(
                "Get conversation error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to fetch conversation",
            });
        }
    }
);


/*
==================================================
REGENERATE LAST RESPONSE
POST /api/chat/:id/regenerate
==================================================
*/

router.post(
    "/:id/regenerate",
    authMiddleware,
    async (req, res) => {
        try {
            const conversation =
                await Conversation.findOne({
                    _id: req.params.id,
                    userId: req.userId,
                });

            if (!conversation) {
                return res.status(404).json({
                    message:
                        "Conversation not found",
                });
            }

            /*
            Need at least:
            user message + assistant response
            */

            if (conversation.messages.length < 2) {
                return res.status(400).json({
                    message:
                        "Nothing to regenerate",
                });
            }

            /*
            Remove the previous AI response.
            */

            const lastMessage =
                conversation.messages[
                    conversation.messages.length - 1
                ];

            if (
                lastMessage.role === "assistant"
            ) {
                conversation.messages.pop();
            }

            /*
            Send the remaining conversation
            back to Gemini.
            */

            const aiMessages =
                conversation.messages.map(
                    (msg) => ({
                        role: msg.role,
                        content: msg.content,
                    })
                );

            const aiResponse =
                await generateAIResponse(
                    aiMessages
                );

            conversation.messages.push({
                role: "assistant",
                content: aiResponse,
            });

            await conversation.save();

            res.json({
                conversationId:
                    conversation._id,
                message: aiResponse,
            });

        } catch (error) {
            console.error(
                "Regenerate error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to regenerate response",
            });
        }
    }
);


/*
==================================================
DELETE CONVERSATION
DELETE /api/chat/:id
==================================================
*/

router.delete(
    "/:id",
    authMiddleware,
    async (req, res) => {
        try {
            const conversation =
                await Conversation.findOneAndDelete({
                    _id: req.params.id,
                    userId: req.userId,
                });

            if (!conversation) {
                return res.status(404).json({
                    message:
                        "Conversation not found",
                });
            }

            res.json({
                message:
                    "Conversation deleted successfully",
            });

        } catch (error) {
            console.error(
                "Delete conversation error:",
                error
            );

            res.status(500).json({
                message:
                    "Failed to delete conversation",
            });
        }
    }
);


export default router;