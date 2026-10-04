import Redis from "ioredis";
import dotenv from "dotenv"

dotenv.config()

const redis_url = process.env.REDIS_URL

export const redis = new Redis(redis_url)