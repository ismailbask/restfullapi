const mongoose=require('mongoose');

mongoose.connect('monglink',{useUnifiedTopology:true,useNewUrlParser:true})
.then(console.log("veri tabanına bağlanıldı"))
.catch(err=>console.log(err));
