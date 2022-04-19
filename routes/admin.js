var express = require('express');
const async = require('hbs/lib/async');
var router = express.Router();
var productHelper = require('../helpers/product-helpers')

const fs = require('fs')

const credential = {
  email : 'ameen123@gmail.com',
  password : 'asdf'
}

const verifyLogin = (req,res,next)=>{
  if(req.session.adminLoggedIn){
    next();
  }else{
    res.redirect('/admin/adminlog')
  }
}

/* GET users listing. */
router.get('/adminlog',(req,res)=>{
  if(req.session.adminLoggedIn){
    res.redirect('/admin/view-users')
  }else{
  res.render('admin/adminlog',{admin:true,'logInErr':req.session.adminLogInErr})
  req.session.adminLogInErr=false
  }
})
router.post('/adminlog',(req,res)=>{
  if(req.body.email == credential.email && req.body.password == credential.password){
    user = req.session.adminLoggedIn=true;
    res.redirect('/admin/view-users')
  }else{
      req.session.adminLogInErr='Invalid Username or Password'
      res.redirect('/admin/adminlog')
  }
}) 
router.get('/',verifyLogin,function(req, res, next) {
  productHelper.getAllProducts().then((products)=>{
    res.render('admin/view-products',{admin:true,products,user});
  })
});
router.get('/view-category',verifyLogin,(req,res)=>{
  productHelper.getAllCategory().then((category)=>{
    res.render('admin/view-category',{admin:true,category,user})
  })
})
router.get('/add-category',verifyLogin,(req,res)=>{
  res.render('admin/add-category',{admin:true,user})
})
router.post('/add-category',(req,res)=>{
  console.log(req.body);
  console.log(req.files.Image);

  productHelper.addCategory(req.body).then((result)=>{
    let image = req.files.Image
   
    image.mv('./public/category-image/'+result+'.jpg',(err,done)=>{
      if(!err){
        res.redirect('/admin/view-category')
      }else{
        console.log(err);
      }
    })
  })
});

router.get('/edit-category/:id',verifyLogin,async (req,res)=>{
  let category =await productHelper.getCategoryDetails(req.params.id)
  res.render('admin/edit-category',{admin:true,category,user})
});

router.post('/edit-category/:id',(req,res)=>{
  let id = req.params.id;
  let image = req.files?.Image;

  if(image){
    fs.unlink(
      './public/category-image/'+id+'.jpg',
      (err, done)=>{
        if(!err){
          image.mv(
            './public/category-image/'+id+'.jpg',
            (err, done)=>{
            }
          )
        }else{
        }
      }
    )
  }

  productHelper.updateCategory(req.params.id,req.body).then(()=>{
    res.redirect('/admin/view-category')
  })
})

router.get('/delete-category/',verifyLogin,(req,res)=>{
  let catId = req.query.id

  fs.unlink(
    './public/category-image/'+proId+'.jpg',
    (err, done)=>{
      if(!err){
        console.log('image removed');
      }else{
      }
    }
  )

  productHelper.deleteCategory(catId).then((response)=>{
    res.redirect('/admin/view-category')
  })
})
router.get('/view-users',verifyLogin,(req,res)=>{
  productHelper.getAllusers().then((users)=>{
    res.render('admin/view-users',{admin:true,users,user})
  })
});

router.get('/add-product',verifyLogin,(req,res)=>{
  res.render('admin/add-product',{admin:true,user})
})
router.post('/add-product',(req,res)=>{
  console.log(req.body);
  console.log(req.files.Image);

  productHelper.addProduct(req.body,(result)=>{
    let image = req.files.Image
   
    image.mv('./public/product-image/'+result+'.jpg',(err,done)=>{
      if(!err){
        res.redirect('/admin/')
      }else{
        console.log(err);
      }
    })
  })
})

router.get('/delete-product/',verifyLogin,(req,res)=>{
  let proId = req.query.id

    fs.unlink(
      './public/product-image/'+proId+'.jpg',
      (err, done)=>{
        if(!err){
          console.log('image removed');
        }else{
        }
      }
    )
  productHelper.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
})
router.get('/edit-product/:id',verifyLogin,async (req,res)=>{
  let product =await productHelper.getProductDetails(req.params.id)
  res.render('admin/edit-product',{admin:true,product})
});

router.post('/edit-product/:id',(req,res)=>{
  let id = req.params.id;
  let image = req.files?.Image;

  if(image){
    fs.unlink(
      './public/product-image/'+id+'.jpg',
      (err, done)=>{
        if(!err){
          image.mv(
            './public/product-image/'+id+'.jpg',
            (err, done)=>{
            }
          )
        }else{
        }
      }
    )
  }

  productHelper.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin/')
  })
})


router.post("/block-user", verifyLogin, (req, res) => {
  productHelper.blockUser(req.body.id).then((response) => {
    if (response) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  });
});


router.post("/unblock-user", verifyLogin, (req, res) => {
  productHelper.unblockUser(req.body.id).then((response) => {
    if (response) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  });
});

router.get('/delete-user/:id',verifyLogin,(req,res)=>{
  let userId = req.params.id
  productHelper.deleteUser(userId).then((response)=>{
    res.redirect('/admin/view-users')
  })
});
router.get('/edit-user/:id',verifyLogin,async (req,res)=>{
  let user =await productHelper.getUserDetails(req.params.id)
  res.render('admin/edit-user',{user,admin:true})
})
router.post('/edit-user/:id',(req,res)=>{
  productHelper.updateUser(req.params.id,req.body).then(()=>{
    res.redirect('/admin/view-users')
  })
})
router.get('/logout',(req,res)=>{
  req.session.admin=null
  req.session.adminLoggedIn=false
  res.redirect('/admin/adminlog')
})



module.exports = router;
