const { log } = require('debug/src/browser');
var db = require('../config/connection')
var collection = require('../config/collections');
const async = require('hbs/lib/async');
var objectId = require('mongodb').ObjectId

module.exports={
    addProduct:(product,callback)=>{
        console.log(product);
        db.get().collection('product').insertOne(product).then((data)=>{
            callback(data.insertedId)
        })
    },
    getAllProducts:()=>{
        return new Promise(async(res,rej)=>{
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            res(products)
        })
    },
    deleteProduct:(proId)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:objectId(proId)}).then((response)=>{
                console.log(response);
                res(response)
            })
        })
    },
    getProductDetails:(proId)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(proId)}).then((product)=>{
                res(product)
            })
        })
    },
    getAllusers:()=>{
        return new Promise(async (res,rej)=>{
            let users =await db.get().collection(collection.USER_COLLECTION).find().toArray()
            res(users)
        })
    },
    getUserDetails:(userId)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.USER_COLLECTION).findOne({_id:objectId(userId)}).then((user)=>{
                res(user)
            })
        })
    },
    deleteUser:(userId)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.USER_COLLECTION).deleteOne({_id:objectId(userId)}).then((response)=>{
                res(response)
            })
        })
    },
    updateProduct:(proId,proDetails)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:objectId(proId)},{
                $set:{
                    Name:proDetails.Name,
                    Description:proDetails.Description,
                    Price:proDetails.Price,
                    Category:proDetails.Category
                }}).then((response)=>{
                    res(response)
                })
        })
    },
    updateUser:(userId,userDetails)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.USER_COLLECTION)
            .updateOne({_id:objectId(userId)},{
                $set:{
                    Name:userDetails.Name,
                    Emailaddress:userDetails.Emailaddress
                }
            }).then((response)=>{
                res()
            })
        })
    },
    getAllCategory:()=>{
        return new Promise(async(res,rej)=>{
            let category = await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            res(category)
        })
    },
    addCategory:(category)=>{
        console.log(category);
        return new Promise((res,rej)=>{
            db.get().collection('category').insertOne(category).then((data)=>{
                
                res(data.insertedId)
            })
        })
    },
    deleteCategory:(catId)=>{
        return new Promise((res,rej)=>{
            db.get().collection(collection.CATEGORY_COLLECTION).deleteOne({_id:objectId(catId)}).then((response)=>{
                console.log(response);
                res(response)
            })
        })
    },
 
 blockUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .updateOne({ _id: objectId(userId) }, { $set: { userBlocked: true } })
        .then((data) => {
          resolve(data);
        });
    });
  },
  
 
   unblockUser: (userId) => {
    return new Promise((resolve, reject) => {
      db.get()
        .collection(collection.USER_COLLECTION)
        .updateOne({ _id: objectId(userId) }, { $set: { userBlocked: false } })
        .then((data) => {
          resolve(data);
        });
    });
  },
  getCategoryDetails: (catId)=>{
    return new Promise((res,rej)=>{
        db.get().collection(collection.CATEGORY_COLLECTION).findOne({_id:objectId(catId)}).then((cat)=>{
            res(cat)
        })
    })
  },
  updateCategory:(catId,catDetails)=>{
    return new Promise((res,rej)=>{
        db.get().collection(collection.CATEGORY_COLLECTION)
        .updateOne({_id:objectId(catId)},{
            $set:{
                Category:catDetails.Category,
            }}).then((response)=>{
                res(response)
            })
    })
}
}