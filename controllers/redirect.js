import { URLSchema } from "../model/model.js";

export const Redirect = async (req, res) => {
    const param = req.param.route;

    if (!param){
        return res.status(400).json({msg: "provide params"})
    }

    try {
        const url = await URLSchema.findOne({short: param})
        if (!url){
            return res.status(404).json({msg: "url not found"})
        }

        const origial = url.origial

        return res.status(300).redirect(origial)
    }catch(e){
        return res.status(500).json({msg:"somthing went wrong"})
    }

}