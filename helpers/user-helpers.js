var db = require('../config/connection')
var collection = require('../config/collections');
const bcrypt = require('bcrypt');
const async = require('hbs/lib/async');
var objectId = require('mongodb').ObjectId

module.exports={
    doSignup:(userData)=>{
        return new Promise(async(res,rej)=>{
            userData.Password=await bcrypt.hash(userData.Password,10)
            db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                return res(data)
            })
        })
    },
    doLogin:(userData)=>{
        return new Promise(async(res,rej)=>{
            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Emailaddress:userData.Email})
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{
                    if(status){
                        response.blocked=user.userBlocked
                        response.user=user
                        response.status=true
                        res(response)
                    }else{
                        console.log('Login failed');
                        res({status:false})
                    }
                })
            }else{
                console.log('user not found');
                res({status:false})
            }
        })
    },
    emailCheck:(email,mob)=>{
        return new Promise(async (res,rej)=>{
            let found = await db.get().collection(collection.USER_COLLECTION).findOne({$or:[{Emailaddress:email},{Mobile:mob}]})
            console.log(found);
            res(found)
        })
    },
    checkPhone:(data)=>{
        return new Promise(async (res,rej)=>{
            let found = await db.get().collection(collection.USER_COLLECTION).findOne({Mobile:data})
            res(found)
        })
    },
    doOtpLogin:(userData)=>{
        return new Promise(async(res,rej)=>{
            let loginStatus = false;
            let response = {}
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Mobile:userData})
            if(user){
                        response.blocked=user.userBlocked
                        response.user=user
                        response.status=true
                        res(response)
            }else{
                console.log('user not found');
                res({status:false})
            }
        })
    },
    productView: (proId)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                res(product)
            })
        })

    }
}