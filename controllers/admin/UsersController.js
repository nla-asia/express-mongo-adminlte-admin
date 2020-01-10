var User = require('../../models/user');
/**
 * list users
 * @param 
 * @public
 * @post
 */

exports.index = async (req, res, next) => {
    console.log(req.user);
    try {

        let data = await User.find();

        return res.render("admin/users/index", {data: data});
    } catch (error) {
        return res.render("admin/users/index", {data: data});
    }
};

/**
 * list users datatable
 * @param 
 * @public
 * @post
 */

exports.index_json = async (req, res, next) => {
    console.log(req.user);
    return res.json({success:true});
};


