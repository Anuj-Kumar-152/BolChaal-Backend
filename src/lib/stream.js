import { StreamChat } from "stream-chat";
import "dotenv/config";

// Support both correct (STREAM_...) and mistyped (STEAM_...) env vars and trim accidental spaces
const rawApiKey = process.env.STREAM_API_KEY || process.env.STEAM_API_KEY || "";
const rawApiSecret = process.env.STREAM_API_SECRET || process.env.STEAM_API_SECRET || "";

const apiKey = rawApiKey.trim() || undefined;
const apiSecret = rawApiSecret.trim() || undefined;

if (!apiKey || !apiSecret) {
  console.error(
    "Stream API key or secret is missing. Set STREAM_API_KEY and STREAM_API_SECRET in your environment (no surrounding spaces)."
  );
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async (userData) => {
  try {
    await streamClient.upsertUsers([userData]);
    return userData;
  } catch (error) {
    console.error("Error upserting Stream user:", error);
  }
};

export const generateStreamToken = (userId) => {
  try {
    console.log("🔐 Generating Stream token...");
    console.log("📌 API Key present:", !!apiKey);
    console.log("📌 API Secret present:", !!apiSecret);

    if (!apiKey || !apiSecret) {
      console.error("❌ Stream credentials NOT loaded. Check .env file.");
      console.error("   Expected: STREAM_API_KEY and STREAM_API_SECRET");
      return null;
    }

    // ensure userId is a string
    const userIdStr = userId.toString();
    console.log("🔄 Creating token for user:", userIdStr);

    const token = streamClient.createToken(userIdStr);

    console.log("✅ Token created successfully:", token ? token.substring(0, 20) + "..." : "null");
    return token;
  } catch (error) {
    console.error("❌ Error generating Stream token:", error.message);
    console.error("Stack:", error.stack);
    return null;
  }
};
