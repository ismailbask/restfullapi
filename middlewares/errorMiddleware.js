
const errorHandler=(err,req,res,next)=>{
//    console.log(err);
    if(err.name==="CastError"){
        return res.status(400).json({
            success:"false",
            messages:"Geçerli bir idye sahip değilsiniz",
        })
    } 
     if(err.code==11000){
        return res.json({
            hataKodu:400,
            success:"false",
            message:`'${Object.keys(err.keyValue)}' için girdiğiniz '${Object.values(err.keyValue)}' önceden alınmıştır.`
        })
    }
    if(err._message==="User validation failed"){
        return res.status(400).json({
            success:"true",
            message:`Girdiğiniz alan en az 3 karakterli olmalı`,
        })
    }
    
    if(err.codeName==="ImmutableField"){
        return res.json({
            message:"Değiştirilemez bir alanı güncellemeye çalıştınız",
            hataKodu:400
        })
    }

    //yakalanmayan hatalar buraya gelir
    return res.json({
        status:err.statusCode||400,
        message:err.message
    });
    // console.log(err._message)
   
    
    
    
    // if(err.message==="Kullanıcı bulunamadı"){
    //     res.status(err.hatakodu).json({
    //         success:"false",
    //         messages:err.message,
    //         hatakodu:err.hatakodu
    //     })
    // }

   

}
module.exports={
    errorHandler
}