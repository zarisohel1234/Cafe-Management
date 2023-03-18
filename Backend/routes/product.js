const express = require('express');
const connection = require('../connection')
const router = express.Router();
var auth = require('../services/authentication')
var checkRole = require('../services/checkRole')

router.post('/add', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    product = req.body;
    query = `INSERT INTO product (name,categoryId,description,price,status) VALUES(?,?,?,?,'true')`
    connection.query(query, [product.name, product.categoryId, product.description, product.price], (err, results) => {
        if (!err) {
            res.status(200).json({ message: 'Product Added Successfully' })
        } else {
            return res.status(500).json(err)
        }
    })
})

router.get('/get', auth.authenticateToken, (req, res, next) => {
    query = `SELECT p.id,p.name,p.description,p.price,p.status,c.id as categoryId, c.name as categoryName FROM product as p INNER JOIN category as c WHERE p.categoryId=c.id`;
    connection.query(query, (err, results) => {
        if (!err) {
            res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let product=req.body
    query=`UPDATE product SET name=?,categoryId=?,description=?,price=? WHERE id=? `;
    connection.query(query,[product.name,product.categoryId,product.description,product.price,product.id],(err,results)=>{
        if(!err){
            if(results.affectedRows==0){
                return res.status(404).json({message:"No Such Product found"})
            }else{
                return res.status(200).json({message:'Product Updated Successfully'})
            }
        }else{
            return res.status(500).json(err)
        }
    })
})

router.get('/getByCategory/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    query = `SELECT id,name from product where categoryId=? and status='true'`;
    connection.query(query,[id],(err, results) => {
        if (!err) {
            return res.status(200).json(results)
        } else {
            return res.status(500).json(err)
        }
    })
})

router.get('/getById/:id', auth.authenticateToken, (req, res, next) => {
    const id = req.params.id;
    query = `select * from product where id=?`;
    connection.query(query,[id],(err,results)=>{
        if (!err) {
            return res.status(200).json(results[0])
        } else {
            return res.status(500).json(err)
        }
    })
})

router.delete('/delete/:id', auth.authenticateToken, checkRole.checkRole, (req, res) => {
    const id=req.params.id;
    query=`DELETE from product WHERE id=? `
    connection.query(query,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows==0){
                return res.status(404).json({message:"No Such Product found"})
            }else{
                return res.status(200).json({message:'Product Deleted Successfully'})
            }
        }else{
            return res.status(500).json(err);
        }
    })
})

router.patch('/updateStatus', auth.authenticateToken, checkRole.checkRole,(req,res)=>{
    let user=req.body;
    query=`update product set status=? where id=?`
    connection.query(query,[user.status,user.id],(err,results)=>{
        if(!err){
            if(results.affectedRows==0){
                return res.status(404).json({message:"No Such Product found"})
            }else{
                return res.status(200).json({message:'Status Updated Successfully'})
            }
        }else{
            return res.status(500).json(err);
        }
    })
})

module.exports = router;

// [{\"id\":1,\"name\":\"Biryani\",\"price\":110,\"total\":150,\"Category\":\"Birya\",\"quantity\":1}]