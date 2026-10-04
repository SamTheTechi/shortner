import { nanoid } from "nanoid";
import { URLSchema } from "../model/model.js";

export const Short = async (req, res)=>{
    const originalURL = req.body.original;

    // validating users url
    try{
        new URL(originalURL);
    }catch(e){
        return res.status(400).json({msg: "Invalid URL provided"});
    }

    try {
        // randome id generated
        const uid = nanoid(7);

        // database create request
        await URLSchema.create({
            origial: originalURL,
            short: uid,
        })

        return res.status(200).json({msg:"url generated", url: uid})
    }catch(e){
        return res.status(500).json({msg: `error occured`, url: "invlide id"})
    }
}