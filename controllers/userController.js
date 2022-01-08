const User=require("../models/userModel");
const asyncHandler = require('express-async-handler');
const bcrypt=require('bcrypt');
const createError = require('http-errors');
const tumUserlarıListele=async(req,res)=>{
    const allUsers=await User.find({});
    res.json({
        messages:"Tüm kullanıcılar getirildi",
        data:allUsers
    })
}

const oturumAcanKullanıcı=(req,res)=>{
    res.status(201).json({
        messages:`idsi olan kullanıcı geldi.`,
        user:req.user
    });
};
const userGuncelle=async (req,res)=>{
    delete req.body.updatedAt;
   delete req.body.createdAt;
//    if(req.body.hasOwnProperty("password")){
//        req.body.password=await bcrypt.hash(req.body.sifre,10);
//    }
   const {error,value}=User.joiValidationForUpdate(req.body);
   if(error){
       next(error);
   }else{
    const editInfo=req.body
    const user=await User.findByIdAndUpdate({_id: req.user.id},editInfo,{new:true,runValidators:true});//runvalidator, şemaya verilen kuralların update işlemlerinde çalışması için kullanıldı

    if(user){
        res.status(201).json({
             messages:"Kullanıcı başarılı bir şekilde güncellendi",
             user
         })
     }
     else{
         // const hataNesnesi=new Error("Kullanıcı bulunamadı");
         // hataNesnesi.hatakodu=404;
 
         //create error daha kullanılabilir olduğundan bu modülü kullandım.
         throw createError(404,"Kullanıcı bulunamadı");
     }
   } 
}
const kullaniciKaydi=asyncHandler (async(req,res,next)=>{
        const user=new User(req.body);//obje oluşturduğumuz için methods kullandık
        user.password=await bcrypt.hash(user.password,10);
        const{error,value}=user.joiValidation(req.body);//req.body yazmayınca da çalışıyor burası
        if(error){
            next(error);
        }
        else{
            const userInfo=await user.save();
            res.status(201).json({
                messages:"Kullanıcı kaydı başarılı",
                data:userInfo
            })
        }
});
const kullaniciGiris=asyncHandler (async (req,res,next)=>{
   const user=await User.girisYap(req.body.email,req.body.password);
   const token=await user.generateToken();
   res.json({
    messages:"Kullanıcı girişi başarılı",
    user,
    token
   });

});
const kullaniciGüncelle=asyncHandler (async(req,res,next)=>{//id ye göre guncelle
//    delete req.body.password;
   delete req.body.updatedAt;
   delete req.body.createdAt;
   if(req.body.hasOwnProperty("password")){
       req.body.password=await bcrypt.hash(req.body.password,10);
   }
   const {error,value}=User.joiValidationForUpdate(req.body);
   if(error){
       next(error);
   }else{
    const editInfo=req.body;
    
    User.findBy
    const user=await User.findByIdAndUpdate({_id:req.params.id},editInfo,{new:true,runValidators:true});//runvalidator, şemaya verilen kuralların update işlemlerinde çalışması için kullanıldı
    if(user){
        res.status(201).json({
             messages:"Kullanıcı başarılı bir şekilde güncellendi",
             user
         })
     }
     else{
         // const hataNesnesi=new Error("Kullanıcı bulunamadı");
         // hataNesnesi.hatakodu=404;
 
         //create error daha kullanılabilir olduğundan bu modülü kullandım.
         throw createError(404,"Kullanıcı bulunamadı");
     }
   }
    
});
const kendiniSil=asyncHandler(async (req,res)=>{//id ye göre guncelle
    const user=await User.findByIdAndDelete({_id:req.user.id});
    // console.log(user);
    if(user){
        res.status(200).json({
            messages:"Kullancı başarılı bir şekilde silindi.",
            
        })
    }
    else{
        throw createError(404,"Kullanıcı bulunamadı");
    }
    
});
const tumKullanicilariSil=asyncHandler(async (req,res)=>{//id ye göre guncelle
    const user=await User.deleteMany({isAdmin:false})//admin olmayan tüm kullanıcısıları sil
    // console.log(user);
    if(user){
        res.status(200).json({
            messages:"Tüm kullanıcılar başarılı bir şekilde silindi.",
            data:req.user
        })
    }
    else{
        throw createError(404,"Kullanıcı bulunamadı");
    }
    
});
const kullaniciSil=asyncHandler(async (req,res)=>{//id ye göre guncelle
    const user=await User.findByIdAndDelete({_id:req.params.id});
    // console.log(user);
    if(user){
        res.status(200).json({
            messages:"Kullancı başarılı bir şekilde silindi.",
            data:req.params.id
        })
    }
    else{
        throw createError(404,"Kullanıcı bulunamadı");
    }
    
})
module.exports={
    tumUserlarıListele,
    oturumAcanKullanıcı,
    userGuncelle,
    kullaniciKaydi,
    kullaniciGiris,
    kullaniciGüncelle,
    kendiniSil,
    tumKullanicilariSil,
    kullaniciSil

}