const express=require('express');
const mongoose=require('mongoose');
// const errorMiddleware=require('./middlewares/errorMiddleware');
const {errorHandler}=require('./middlewares/errorMiddleware')
//routes
const user=require('./routers/user');
require('./db/dbConnection');//veritabanı bağlantısı
const app=express();
app.use(express.json());
// app.use(express.urlencoded({extended:true}));
app.use('/api/users',user);


app.use(errorHandler);
app.listen(5000,()=>{
    console.log("Server 5000 portunda çalışıyor");

})
