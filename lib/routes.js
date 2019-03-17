const db = require('./db.js');
const usersController = require('./controllers/users');
const transactionsController = require('./controllers/transactions');
const organisationsController = require('./controllers/organisations');
const auth = require('./shared/auth.js');
const jwt = auth.jwt;
const jwtSecret = auth.jwtOptions.secretOrKey;
const passport = auth.passport;


function routes(app) {
    app.get('/', (req, res) => {
        res.status(200).json('Core API online')
    })

    //General ENPOINTS
    app.get('/secretRoute', (req, res) => {
        res.status(200).json({
            message: 'Kawabanga',
            status: true
        })
    })

    app.post('/testRoute', passport.authenticate('jwt', {
        session: false,
    }), (req, res) => {
        res.status(200).json({
            message: 'The Cake Is A Lie!!!',
            status: true
        });
    });

    //USER CRUD Endpoints 
    app.post('/users/login', (req, res) => {
        let params = req.body;
        //type check
        if ((params.email instanceof Array || params.password instanceof Array) || (params.email === null || params.email === undefined) || (params.password === null || params.password === undefined)) {
            res.status(400).json({
                message: 'malformed request',
                status: false
            })
        } else {
            usersController.login(params)
                .then((result) => {
                    const token = jwt.sign({email: req.body.email}, jwtSecret) ;
                    res.status(200).json({
                        message: 'Login Successful',
                        status: true,
                        data: result,
                        token: token
                    })
                })
                .catch((error) => {
                    res.status(500).json({
                        message: 'failed',
                        status: false
                    })
                })
        }
    })

    app.post('/users/create', (req, res) => {
        var user = req.body.user;

        if ((user == null) || (user == undefined) || (typeof (user) != 'object')) {
            res.status(400).json({
                message: 'malformed request',
                status: false
            })
        } else {
            usersController.create(user)
                .then((result) => {
                    res.status(200).json({
                        message: 'create successful',
                        status: true,
                        data: result
                    })
                })
                .catch((error) => {
                    console.log(error);
                    res.status(500).json({
                        message: 'failed',
                        status: false
                    })
                })
        }
    })

    app.post('/users/transactions', (req, res) => {
        var user = req.body.user;

        if ((user == null) || (user == undefined) || (typeof (user) != 'object')) {
            res.status(400).json({
                message: 'malformed request',
                status: false
            })
        } else {
            usersController.getUserTransactions((result) => {
                    res.status(200).json({
                        message: 'create successful',
                        status: true,
                        data: result
                    })
                })
                .catch((error) => {
                    res.status(500).json({
                        message: 'failed',
                        status: false
                    })
                })
        }
    })

    app.post('/users/remove', (req, res) => {
        var user = req.body.user;

        if ((user == null) || (user == undefined) || (typeof (user) != 'object')) {
            res.status(400).json({
                message: 'malformed request',
                status: false
            })
        } else {
            transactionsController.create(user)
                .then((result) => {
                    res.status(200).json({
                        message: 'create successful',
                        status: true,
                        data: result
                    })
                })
                .catch((error) => {
                    res.status(500).json({
                        message: 'failed',
                        status: false
                    })
                })
        }
    })


    // Transactions Endpoints

    app.post('/transactions/create', (req, res) => {
        var user = req.body.user;

        if ((user == null) || (user == undefined) || (typeof (user) != 'object')) {
            res.status(400).json({
                message: 'malformed request',
                status: false
            })
        } else {
            transactionsController.create(user)
                .then((result) => {
                    res.status(200).json({
                        message: 'create successful',
                        status: true,
                        data: result
                    })
                })
                .catch((error) => {
                    res.status(500).json({
                        message: 'failed',
                        status: false
                    })
                })
        }
    })

    app.post('/transactions/edit', (req, res) => {
        var id = req.body.id;
        if ((id == null) || (id == undefined) || (typeof (id) != 'string')) {
            res.status(401).json({
                message: 'malformed request',
                status: false
            })
        } else {
            transactionsController.edit(req.body.id)
                .then((result) => {
                    res.status(200).json({
                        message: 'get successful',
                        status: true
                    })
                })
                .catch((error) => {
                    res.status(500).json({
                        message: 'get error',
                        status: false
                    })
                })
        }
    })

    app.post('/transactions/delete', (req, res) => {
        var id = req.body.userInfo;
        if ((userInfo == null) || (userInfo == undefined) || (typeof (userInfo) != 'object')) {
            res.status(401).json({
                message: 'malformed request'
            })
        } else {
            transactionsController.removeTransactions(userInfo)
                .then((result) => {
                    res.status(200).json({
                        message: 'update successful',
                        status: true
                    })
                })
                .catch((error) => {
                    res.status(500).json({
                        message: 'update error',
                        status: false
                    })
                })
        }
    })

    // Organisation Endpoints

    app.post('/organisations/create', (req, res) => {
        var organisation = req.body.organisation;

        if ((organisation == null) || (organisation == undefined) || (typeof (organisation) != 'object')) {
            res.status(400).json({
                message: 'malformed request',
                status: false
            })
        } else {
            organisationsController.create(organisation)
                .then((result) => {
                    res.status(200).json({
                        message: 'create successful',
                        status: true,
                        data: result
                    })
                })
                .catch((error) => {
                    console.log('Error: ', error);
                    res.status(500).json({
                        message: 'failed',
                        status: false
                    })
                })
        }
    })

    app.post('/organisations/edit', (req, res) => {
        var organisation = req.body.organisation;
        if ((organisation == null) || (organisation == undefined) || (typeof (organisation) != 'string')) {
            res.status(401).json({
                message: 'malformed request',
                status: false
            })
        } else {
            organisationsController.edit(req.body.organisation)
                .then((result) => {
                    res.status(200).json({
                        message: 'get successful',
                        status: true
                    })
                })
                .catch((error) => {
                    res.status(500).json({
                        message: 'get error',
                        status: false
                    })
                })
        }
    })

    app.post('/organisations/delete', (req, res) => {
        var id = req.body.id;
        if ((id == null) || (id == undefined) || (typeof (id) != 'object')) {
            res.status(401).json({
                message: 'malformed request'
            })
        } else {
            organisationsController.removeOrganisation(id)
                .then((result) => {
                    res.status(200).json({
                        message: 'update successful',
                        status: true
                    })
                })
                .catch((error) => {
                    res.status(500).json({
                        message: 'update error',
                        status: false
                    })
                })
        }
    })


}

module.exports.routes = routes;