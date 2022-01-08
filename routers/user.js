const router=require('express').Router();

const authMiddleware=require("../middlewares/authMiddleware");
const adminMiddleware=require("../middlewares/adminMiddleware");
const userController=require("../controllers/userController");
//Tüm kullanıcıları getirme
router.get('/',[authMiddleware,adminMiddleware],userController.tumUserlarıListele);
//giriş yapan user bilgilerini listeler
router.get('/me',authMiddleware,userController.oturumAcanKullanıcı);
router.patch('/me',authMiddleware,userController.userGuncelle)
router.post('/',userController.kullaniciKaydi);
router.post('/giris',userController.kullaniciGiris);
router.put('/:id',[authMiddleware,adminMiddleware],userController.kullaniciGüncelle);
router.delete('/me',authMiddleware,userController.kendiniSil);
router.get('/deleteall',[authMiddleware,adminMiddleware],userController.tumKullanicilariSil);
router.delete('/:id',userController.kullaniciSil);
module.exports=router;