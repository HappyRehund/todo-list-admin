// import { createEnv } from "@t3-oss/env-nextjs"
// import { z } from "zod"

// export const env = createEnv({
//   // Tentukan schema di sini
//   server: {
//     REDIS_URL: z.string().min(1),
//     REDIS_TOKEN: z.string().min(1),
//     DATABASE_URL: z.string().min(1), // Sebaiknya validasi juga DATABASE_URL
//   },
  
//   // Ganti `experimental__runtimeEnv` dengan `runtimeEnv` yang eksplisit
//   runtimeEnv: {
//     REDIS_URL: process.env.REDIS_URL,
//     REDIS_TOKEN: process.env.REDIS_TOKEN,
//     DATABASE_URL: process.env.DATABASE_URL,
//   },
  
//   emptyStringAsUndefined: true,
// });