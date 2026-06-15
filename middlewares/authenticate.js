function isLogin(req, res, next) {
    if (req.session.login) {
        next()
    } else {
        res.redirect("/login")
    }
    
}

function isSuperAdmin(req, res, next) {
    if (req.session.login) {
        if (req.session.role === "Super Admin") {
            next()
        } else {
            res.redirect("/admin")
        }
    } else {
        res.redirect("/login")
    }
}

module.exports = {
    isLogin,
    isSuperAdmin
}