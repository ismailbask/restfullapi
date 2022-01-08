const admin=(req,res,next)=>{
    if(!req.user.isAdmin){
        return res.status(403)
        .json({
            message:"Yetkiniz olmayan bir alana erişmeye çalışıyorsunuz."
        });
   }
         next();
};
module.exports=admin;