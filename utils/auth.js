let autenticacion = (req, res, next) => {
    if (req.session && req.session.usuario)
        return next();
    else
        res.render("login");
};

let rol = (rol) => {
    return (req, res, next) => {
        if (rol === req.session.rol)
            next();
        else
            res.render("login");
    };
};