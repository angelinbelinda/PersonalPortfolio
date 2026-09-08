const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==========================================
// CORS
// ==========================================

app.use(
    cors({
        origin: [
            "http://127.0.0.1:5500",
            "http://localhost:5500"
        ]
    })
);

// ==========================================
// JSON DATA
// ==========================================

app.use(express.json());

// ==========================================
// MONGODB CONTACT SCHEMA
// ==========================================

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create Contact model
const Contact = mongoose.model("Contact", contactSchema);

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {

    res.json({
        success: true,
        message: "Portfolio Backend is running successfully!"
    });

});

// ==========================================
// SAVE CONTACT MESSAGE
// ==========================================

app.post("/api/contact", async (req, res) => {

    console.log("\n========== NEW CONTACT MESSAGE ==========");

    const { name, email, message } = req.body;

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);

    // --------------------------------------
    // CHECK EMPTY FIELDS
    // --------------------------------------

    if (!name || !email || !message) {

        console.log("ERROR: Missing form data");
        console.log("========================================\n");

        return res.status(400).json({
            success: false,
            message: "Please fill in all fields."
        });

    }

    try {

        // --------------------------------------
        // CREATE CONTACT DOCUMENT
        // --------------------------------------

        const newContact = new Contact({
            name: name,
            email: email,
            message: message
        });

        // --------------------------------------
        // SAVE TO MONGODB
        // --------------------------------------

        await newContact.save();

        console.log("Message saved to MongoDB successfully!");
        console.log("========================================\n");

        res.status(200).json({
            success: true,
            message: "Your message was received successfully!"
        });

    } catch (error) {

        console.error("MongoDB save error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to save your message."
        });

    }

});

// ==========================================
// GET ALL CONTACT MESSAGES
// ==========================================

app.get("/api/contact", async (req, res) => {

    try {

        // Get all messages
        // Newest messages appear first
        const messages = await Contact
            .find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            messages: messages
        });

    } catch (error) {

        console.error("Error fetching messages:", error);

        res.status(500).json({
            success: false,
            message: "Failed to load messages."
        });

    }

});

// ==========================================
// CONNECT TO MONGODB
// ==========================================

mongoose
    .connect(process.env.MONGODB_URI)

    .then(() => {

        console.log("MongoDB connected successfully!");

        // --------------------------------------
        // START SERVER
        // --------------------------------------

       app.listen(PORT, "0.0.0.0", () => {

            console.log("========================================");
            console.log("Portfolio Backend Started!");
            console.log(
                "Server: http://127.0.0.1:" + PORT
            );
            console.log("========================================");

        });

    })

    .catch((error) => {

        console.error("MongoDB connection failed:");
        console.error(error);

    });