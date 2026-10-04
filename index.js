import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { Short } from "./controllers/short.js";
import { Redirect } from "./controllers/redirect.js";
import { fileURLToPath } from "url"


dotenv.config();

const app = express();
const _filename = fileURLToPath(import.meta.url)
const _dirname = path._dirname(_filename)


const Limit = rateLimit({
    windowMs: 60 * 1000,
    max: 300,
    standardHeaders: true,
    legacyHeaders: true,
})

app.use(express.json({ limit: "10kb" }));
app.use(cors());
app.use(Limit)
app.use(mongoSanitize())
app.use(helmet())

app.post("/short", Short);
app.get("/:route", Redirect)

const port = process.env.PORT || "3000"

const start = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL)
        app.listen(port, "0.0.0.0", () => {
            console.log("server started!!");
        })
    }
    catch(e){
        console.warn(`somethings went ${e}`);
    }
}

start();