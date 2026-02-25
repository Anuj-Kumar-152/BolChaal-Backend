import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    console.log("📍 Token endpoint hit");
    console.log("🔑 User ID:", req.user?.id);
    console.log("📋 User object:", req.user);

    if (!req.user) {
      
      console.error("❌ No user in request");
      return res.status(401).json({ message: "User not authenticated" });
    }

    const token = generateStreamToken(req.user.id);

    if (!token) {
      console.error("❌ Failed to generate Stream token for user:", req.user.id);
      return res.status(500).json({ message: "Failed to generate Stream token—check Stream API keys in server logs" });
    }

    console.log("✅ Token generated successfully for user:", req.user.id);
    res.status(200).json({ token });
  } catch (error) {
    console.error("🔥 Error in getStreamToken controller:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
}
