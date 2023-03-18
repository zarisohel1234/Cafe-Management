const express = require('express');
const connection = require('../connection')
const router = express.Router();
let ejs = require('ejs');
const fs = require('fs');
let pdf = require('html-pdf');
const path = require('path');
const uuid = require('uuid');
var auth = require('../services/authentication');


router.post('/generateBill', auth.authenticateToken, (req, res) => {
    let generatedUuid = uuid.v1();
    const orderDetails = req.body;
    var productDetailsReport = JSON.parse(orderDetails.productDetails)
    query = `insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetails,createdBy) values(?,?,?,?,?,?,?,?)`
    connection.query(query, [orderDetails.name, generatedUuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.totalAmount, orderDetails.productDetails, res.locals.email], (err, results) => {
        if (!err) {
            ejs.renderFile(path.join(__dirname,'','report.ejs'), {
                productDetails: productDetailsReport, name: orderDetails.name, email: orderDetails.email,
                contactNumber: orderDetails.contactNumber, paymentMethod: orderDetails.paymentMethod, totalAmount: orderDetails.totalAmount
            }, (err, results) => {
                if (err) {
                    return res.status(500).json(err.message)
                } else {
                    pdf.create(results).toFile('./generated_pdf/' + generatedUuid + '.pdf', (err, data) => {
                        if (err) {
                            // console.log('In')
                            console.log(err)
                            return res.status(500).json(err)
                        } else {
                            return res.status(200).json({ uuid: generatedUuid })
                        }
                    })
                }
            })
        } else {
            return res.status(500).json(err);
        }
    })
})


router.post('/getPdf',auth.authenticateToken,(req,res)=>{
    const orderDetails=req.body
    const pdfPath='./generated_pdf/'+orderDetails.uuid+'.pdf'
    if(fs.existsSync(pdfPath)){
        res.contentType('application/pdf');
        fs.createReadStream(pdfPath).pipe(res);
    }else{
        var productDetailsReport=JSON.parse(orderDetails.productDetails);
        ejs.renderFile(path.join(__dirname,'','report.ejs'), {
            productDetails: productDetailsReport, name: orderDetails.name, email: orderDetails.email,
            contactNumber: orderDetails.contactNumber, paymentMethod: orderDetails.paymentMethod, totalAmount: orderDetails.totalAmount
        }, (err, results) => {
            if (err) {
                return res.status(500).json(err.message)
            } else {
                pdf.create(results).toFile('./generated_pdf/' + orderDetails.uuid + '.pdf', (err, data) => {
                    if (err) {
                        console.log(err)
                        return res.status(500).json(err)
                    } else {
                        // return res.status(200).json({ uuid: generatedUuid })
                        res.contentType('application/pdf');
                        fs.createReadStream(pdfPath).pipe(res)
                    }
                })
            }
        })
    }
})

router.get('/getBills', auth.authenticateToken, (req, res) => {
    query=`select * from bill order by id DESC `
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results)
        }else{
            return res.status(500).json(err)
        }
    })
})

router.delete('/deleteBill/:id',auth.authenticateToken,(req,res)=>{
    let id = req.params.id;
    query=`delete from bill where id=?`;
    connection.query(query,[id],(err,results)=>{
        if(!err){
            if(results.affectedRows==0){
                return res.status(404).json({message:'Bill not found'});
            }else{
                return res.status(200).json({message:'Bill Deleted Successfully'})            }

        }else{
            return res.status(500).json(err)
        }
    })
})

module.exports=router;