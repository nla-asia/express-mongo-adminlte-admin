
/**
 * list users
 * @param 
 * @public
 * @post
 */

exports.index = async (req, res, next) => {

    console.log(req.user);

    return res.render("admin/users/index", {user: req.user});
};