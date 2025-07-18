import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL); // 또는 Windows 호스트 IP
    console.log("Connected to DB");
  } catch (error) {
    console.error("DB Connection Error:", error);
  }
};

connectDB();

const db = mongoose.connection;

db.on("error", (error)=> console.log("DB Error", error)) // on은 여러번 가능
