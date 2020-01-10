const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
//models
const User = require("../models/user");

/**
 * login
 * @param 
 * @public
 * @get
 */

exports.login = async (req, res, next) => {

    res.render('admin/auth/login', {layout: 'admin/auth_layout', title: 'Express' });
};

/**
 * loginpost
 * @param 
 * @public
 * @post
 */

exports.login_post = async (req, res, next) => {
    console.log("login success");
   return res.redirect('/admin/users');
};

/**
 * register
 * @param 
 * @public
 * @get
 */

exports.register = async (req, res, next) => {

    res.render('admin/auth/register', {layout: 'admin/auth_layout', title: 'Express' });
};

/**
 * register_post
 * @param 
 * @public
 * @post
 */

exports.register_post = async (req, res, next) => {
    let formData = req.body;
    console.log(formData);

    try {
    const err = validationResult(req);
    if (!err.isEmpty()){
        console.log(err.errors);
        return res.redirect("/register");
    } 
   let {user_name,email, phone_number, password} = formData;
    const userAccount = new User({
        _id: new mongoose.Types.ObjectId(),
        user_name,
        email,
        phone_number,
    });
  
    let hashed = await bcrypt.hash(password, 10);
    userAccount.password = hashed;
    userAccount.role = "admin";//TODO: set defaultRole in config
    userAccount.is_verified = true;
    let userCreated = await userAccount.save();
    console.log(userCreated);
    return res.redirect("/login");
}catch(err){
    console.log(err);
    return res.redirect("/register");
}

};