app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('libros');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post("/login", (req, res, next) => {
    let login = req.body.login;
    let password;

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            password = hash;
        });
    });

    let existeUsuario = usuario.filter(
        (usuario) => usuario.usuario == login && usuario.password == password
    );

    if (existeUsuario.length > 0) {
        req.session.usuario = existeUsuario[0].usuario;
        req.session.rol = existeUsuario[0].rol;
        res.redirect("libros");
    } else {
        res.render("login", { error: "Usuario o contraseña incorrectos" });
    }
});