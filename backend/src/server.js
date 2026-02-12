const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

console.log("🚀 Backend starting...");

(async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.log("❌ MONGO_URI missing. Check .env file");
      process.exit(1);
    }

    await connectDB(process.env.MONGO_URI);

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`📄 Swagger Docs: http://localhost:${PORT}/api-docs`);
    });
  } catch (err) {
    console.error("❌ Server crashed:", err.message);
    process.exit(1);
  }
})();
