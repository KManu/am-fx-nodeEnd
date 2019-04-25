const usersController = require('./controllers/users');
const transactionsController = require('./controllers/transactions');
const organisationsController = require('./controllers/organisations');
const currenciesController = require('./controllers/currencies');
const jwt_auth = require('./shared/jwt_auth.js');
const utils = require('./shared/utils');
const auth = require('./shared/auth');
const jwt = jwt_auth.jwt;
const jwtSecret = jwt_auth.jwtOptions.secretOrKey;
const passport = jwt_auth.passport;


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
                    const token = jwt.sign({
                        email: req.body.email
                    }, jwtSecret);
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
        const user = req.body.user;

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
        const user = req.body.user;

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
        const user = req.body.user;

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

    app.post('/users/getByID', (req, res) => {
        const user = req.body.user;

        if ((user == null) || (user == undefined) || (typeof (user) != 'object')) {
            res.status(400).json({
                message: 'malformed request',
                status: false
            })
        } else {
            usersController.getUserDetailsByID(user.id)
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
        const transaction = req.body.transaction;

        if ((transaction == null) || (transaction == undefined) || (typeof (transaction) != 'object')) {
            console.log();
            res.status(400).json({
                message: 'malformed request',
                status: false
            })
        } else {
            transactionsController.create(transaction)
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

    app.post('/transactions/getByID', (req, res) => {
        const id = req.body.id;
        console.log(typeof (id));
        if ((id == null) || (id == undefined) || (typeof (id) != 'string')) {
            res.status(401).json({
                message: 'malformed request',
                status: false
            })
        } else {
            transactionsController.getTransactionsByUser(id)
                .then((result) => {
                    res.status(200).json({
                        message: 'get successful',
                        status: true,
                        data: result
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
        const id = req.body.userInfo;
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

    app.post('/transactions/getOrgTransactions', (req, res) => {
        const code = req.body.code;
        const type = req.body.type || 'buy';

        if ((code == null) || (code == undefined) || (typeof (code) != 'string')) {
            console.log(req.body.code);
            res.status(400).json({
                message: 'malformed request',
                status: false
            })
        } else {
            transactionsController.getTransactionsByOrg(code, type)
                .then((result) => {
                    res.status(200).json({
                        message: 'get successful',
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
    });

    // Organisation Endpoints

    app.post('/organisations/create', (req, res) => {
        const organisation = req.body.organisation;

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

    app.get('/organisations/getAll', (req, res) => {
        organisationsController.getOrganisations()
            .then((result) => {
                res.status(200).json({
                    message: 'get successful',
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
    })

    app.post('/organisations/getByCode', (req, res) => {
        const code = req.body.code;

        if ((code == null) || (code == undefined) || (typeof (code) != 'object')) {
            res.status(400).json({
                message: 'malformed request',
                status: false
            })
        } else {
            organisationsController.getOrganisationByCode(code)
                .then((result) => {
                    res.status(200).json({
                        message: 'get successful',
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
        const organisation = req.body.organisation;
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
        const id = req.body.id;
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


    // Currencies endpoint

    app.post('/currencies/getByOrg', (req, res) => {
        const user = req.body.user;

        if ((user == null) || (user == undefined) || (typeof (user) != 'object')) {
            res.status(400).json({
                message: 'malformed request',
                status: false
            })
        } else {
            auth.isOrgAdmin(user)
                .then(next => {
                    if (next === true) {
                        currenciesController.getByOrg(user)
                            .then((result) => {
                                res.status(200).json({
                                    message: 'get successful',
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
                    } else {
                        // not authed
                        res.status(401).json({
                            message: 'unauthorised action for user',
                            status: false
                        })
                    }
                });
        }
    })

    app.post('/currencies/upsert', (req, res) => {
        const user = req.body.user;
        const currency = req.body.currency;

        if ((user == null) || (user == undefined) || (typeof (user) != 'object')) {
            res.status(400).json({
                message: 'malformed request',
                status: false
            })
        } else {
            auth.isOrgAdmin(user)
                .then(next => {
                    if (next === true) {
                        currenciesController.upsert(currency)
                        .then(result => {
                            res.status(200).json({
                                message: 'successful',
                                status: true
                            })
                        })
                        .catch((error) => {
                            console.log('Error: ', error);
                                res.status(500).json({
                                    message: 'failed',
                                    status: false
                                })
                        })
                    } else {
                        // not authed
                        res.status(401).json({
                            message: 'unauthorised action for user',
                            status: false
                        })
                    }
                });
        }
    })




}

module.exports.routes = routes;