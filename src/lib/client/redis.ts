// import { env } from "@/schemas/env";
import { Redis } from "@upstash/redis";

export const redisClient = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN
})