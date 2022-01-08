const jwt=require("jsonwebtoken");
const User=require("../models/userModel");
const asyncHandler = require ('express-async-handler');
const auth=asyncHandler( async(req,res,next)=>{
    if(!req.header('Authorization')){
        throw new Error("Lütfen giriş yapınız");
    }else{
        const token=req.header('Authorization').replace('Bearer ','');//header içindeki bearer ile boşluğu sildik.
        const sonuc=jwt.verify(token,'secret_key');
        // console.log("Gelen sonuc",sonuc);
        const bulunanUser=await User.findById({_id:sonuc._id});
        if(bulunanUser)req.user=bulunanUser;
        else{
            throw new Error("Lütfen giriş yapınız")
        }
        console.log(req.user);
        next();
    }
    

})
module.exports=auth;