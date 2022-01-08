const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const Joi=require('@hapi/joi');
const createError = require('http-errors');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const UserSchema=new Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:50
    },
    userName:{
        type:String,
        required:true,
        trim:true,
        minlength:3,
        maxlength:50,
        unique:true,
        lowercase:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        unique:true
    },
    password:{
        type:String,
        minlength:6,
        required:true,
        trim:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},{collection:'user',timestamps:true});


//joi şemasını oluşturduk.
const schema=Joi.object({
    name:Joi.string().min(3).max(50).trim(),
    userName:Joi.string().min(3).max(50).trim(),
    email:Joi.string().email().trim(),
    password:Joi.string().min(6).trim(),
});
//kullanıcı girişi
UserSchema.statics.girisYap=async(email,password)=>{
    const {error,value}=schema.validate({email,password});
    if(error){
        throw createError(400,error);
    }
   const user= await User.findOne({email});
   if(!user){
       throw createError(400,"girilen email hatalı")
   }
   const sifreKontrol=await bcrypt.compare(password,user.password);
   if(!sifreKontrol){
    throw createError(400,"girilen şifre hatalı")
   }
   return user;
}
//kullanıcı girişi yapılırken token oluşturuldu
UserSchema.methods.generateToken=async function(){
    const girisYapanUser=this;
    const token=jwt.sign({_id:girisYapanUser._id,name:girisYapanUser.name,username:girisYapanUser.userName,email:girisYapanUser.email},'secret_key',{expiresIn:'1h'});
    return token;
}
//yeni kullanıcı eklemek için
UserSchema.methods.joiValidation=function(userObject){
    schema.required;
    return schema.validate(userObject);
}
//kullanıcı güncellemek için.
UserSchema.statics.joiValidationForUpdate=function(userObject){
    return schema.validate(userObject);
}
//Kullanıcı kaydı oluştuktan sonra bazı alanları datadan çıkarıyoruz. res kısmından kaldırıyoruz.
UserSchema.methods.toJSON=function(){
    const user=this.toObject();
    // delete user._id;
    delete user.createdAt;
    delete user.updatedAt;
    delete user.__v;
    delete user.password;
    return user;
}
// UserSchema.pre("save",function(next){
//     if(!this.isModified("password")) next();
//     bcrypt.genSalt(10,(err,salt)=>{
//         if(err) next(err);
//         bcrypt.hash(this.password,salt,(err,hash)=>{
//             if(err) next(err);
//             this.password=hash;
//             next();
//         });
//     });
// });
const User=mongoose.model('User',UserSchema);

module.exports=User;