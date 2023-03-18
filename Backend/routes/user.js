const express = require('express');
const connection = require('../connection')
var auth=require('../services/authentication')
var checkRole=require('../services/checkRole')
const router = express.Router();
const nodemailer = require('nodemailer');
let jwt = require('jsonwebtoken');

require('dotenv').config()

//User Sign-Up
router.post('/signup', (req, res) => {
    let user = req.body;
    query = "select email,password,role,status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                query = "insert into user (name,contactNumber,email,password,status,role) values (?,?,?,?,'false','user')"
                connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, results) => {
                    if (!err) {
                        return res.status(200).json({ message: "Successfully Registered" })
                    }
                    else {
                        return res.status(500).json(err)
                    }
                })
            }
            else {
                return res.status(400).json({ message: 'Email Already Exist' });
            }
        }
        else {
            return res.status(500).json(err)
        }
    })

})

//User Login
router.post('/login', (req, res) => {
    let user = req.body
    query = "select email,password,role,status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0 || results[0].password != user.password) {
                return res.status(401).json({ message: 'Incorrect UserName or Password' })
            } else if (results[0].status === 'false') {
                return res.status(401).json({ message: "Wait for Admin Approval" })
            } else if (results[0].password === user.password) {
                const response = { email: results[0].email, role: results[0].role }
                const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' })
                res.status(200).json({ token: accessToken })
            }
            else {
                return res.status(400).json({ message: "Something went Wrong.Please try Later" })
            }
        }
        else {
            // console.log("error");
            return res.status(500).json({ err })
        }
    })
})


//User Forgot Password
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})

router.post('/forgotpassword', (req, res) => {
    let user = req.body
    query = "select email,password,role,status from user where email=?";
    connection.query(query, [user.email], (err, results) => {
        if (!err) {
            if (results.length <= 0) {
                return res.status(200).json({ message: 'Password is Sent to Your Email' })
            } else {
                var mailOptions = {
                    from: process.env.EMAIL,
                    to: results[0].email,
                    subject: "Password of Your Coffee Management System is",
                    html: `<p>
                    <b>Your Login Details for Coffee Management System is </b>
                    <br>
                    <b>Email : </b> ${results[0].email}
                    <b>Password : </b> <br>
                    <h1>${results[0].password}</h1><br>
                    </p>`
                };
                transporter.sendMail(mailOptions, (err, info) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(info.response);
                    }
                });
                return res.status(200).json({ message: 'Password is Sent to your Email' })
            }
        } else {
            return res.status(500).json(err)
        }
    })
})


router.get('/get',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    query=`SELECT id,name,email,status,contactNumber FROM user WHERE role='user'`;
    connection.query(query,(err,results)=>{
        if(!err){
            return res.status(200).json(results)
        }
        else{
            return res.status(500).json(err)
        }
    })
})


router.patch('/update',auth.authenticateToken,checkRole.checkRole,(req,res)=>{
    let user=req.body;
    query=`UPDATE user set status=? WHERE id=?`
    connection.query(query,[user.status,user.id],(err,results)=>{
        if(!err){
            if(results.affectedRows==0){
                return res.status(404).json({message:'User id is Not Exist'})
            }else{
                return res.status(200).json({message:'User Updated Successfully'})
            }
        }  
        else{
            return res.status(500).json(err)
        }
    })
})

router.get('/checkToken',auth.authenticateToken,(req,res)=>{
    return res.status(200).json({message:'true'})
})

router.post('/changepassword',auth.authenticateToken,(req,res)=>{
    const user=req.body;
    const email=res.locals.email;
    var query='SELECT * FROM user WHERE email=? and password=?';
    connection.query(query,[email,user.oldPassword],(err,results)=>{
        if(!err){
            if(results.length<=0){
                return res.status(400).json({message:'Incorrect Old Password'})
            }else if(results[0].password==user.oldPassword){
                // return res.status
                query=`UPDATE user set password=? WHERE email=?`;
                connection.query(query,[user.newPassword,email],(err,results)=>{
                    if (!err) {
                        return res.status(200).json({message:'Updated your Password'})
                    }else{
                        return res.status(500).json(err)
                    }
                })
            }else{
                return res.status(400).json({message:'Something Wrong'})
            }
        }
        else{
            return res.status(500).json(err)
        }
    })
})
module.exports = router