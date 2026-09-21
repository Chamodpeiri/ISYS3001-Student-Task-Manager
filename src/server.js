require("dotenv").config();

const app = require("./app");
const { connectDatabase } = require("./config/database");

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Task Manager running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
