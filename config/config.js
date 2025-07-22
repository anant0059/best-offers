import dotenv from "dotenv";

dotenv.config();

export default function () {
    process.bestoffer = {
        db: {
            url: process.env.MONGO_URL || "mongodb://localhost:27017/bestoffer",
        },
        app: {
            port: process.env.PORT || 3000,
        }
    };
}