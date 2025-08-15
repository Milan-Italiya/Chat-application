import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // Import cookie-parser
import authRoutes from './routes/auth.route.js'; // Assuming your auth routes are here
import messageRoute from './routes/message.route.js'; // Assuming your auth routes are here
import cors from "cors"
import path from "path"
import { connectDB } from './lib/db.js'; // Assuming you have a DB connection file
import { app, server } from './lib/socket.js';

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 5000;
const __dirname = path.resolve()

// --- Core Middlewares ---
app.use(express.json({ limit: "10mb" })); // To parse JSON request bodies (for req.body)
app.use(cookieParser()); // To parse cookies from the request (for req.cookies) <--- ADD THIS LINE
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

// --- Routes ---
app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoute)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/dist")))

    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../client", "dist", "index.html"))
    }
// app.use("/api/other", otherRoutes); // Example for other routes

// // Basic route for testing
// app.get("/", (req, res) => {
//         res.send("API is running!");
//     });

    // --- Server Start ---
    server.listen(PORT, () => {
        connectDB(); // Connect to your database
        console.log(`Server running on port ${PORT}`);
    });