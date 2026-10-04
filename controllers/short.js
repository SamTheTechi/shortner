import { nanoid } from "nanoid";
import { URLSchema } from "../model/model.js";
import { redis } from "../model/redis.js";

export const Short = async (req, res)=>{
    const originalURL = req.body.original;

    // validating users url
    try{
        new URL(originalURL);
    }catch(e){
        return res.status(400).json({msg: "Invalid URL provided"});
    }

    try {
        const key = `short:${originalURL}`
        
        // check if write alredy exist in redis
        const cache = await redis.get(key);
        if (cache){
            return res.status(200).json({url: cache, msg:`short url alredy exist`})
        }

        const distributed_lockKey = `lock:${originalURL}`

        try {
            const lockAcquired = await redis.set(distributed_lockKey, "true", "EX", 3, "NX")

            if(!lockAcquired){
                return res.status(409).json(
                    {msg: "this url is locked try again later"}
                )
            }


            // check on database before generating 
            const exists = await URLSchema.findOne({origial: originalURL});
            if (exists){
                return res.status(200).json(
                    {url: exists.short, msg: 'short url alredy exist'}
                )
            }


            // randome id generated and create
            const uid = nanoid(7);
            await URLSchema.create({
                origial: originalURL,
                short: uid,
            })

            await redis.set(key, uid, "EX", 60 * 60 * 24 * 5);

            return res.status(200).json({msg:"url generated", url: uid})

        }finally{
            await redis.del(distributed_lockKey);
        }
    }catch(e){
        return res.status(500).json({msg: `error occured`, url: "invlide id"})
    }
}