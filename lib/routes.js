const usersController = require('./controllers/users.ctrl');
const transactionsController = require('./controllers/transactions.ctrl');
const organisationsController = require('./controllers/organisations.ctrl');
const currenciesController = require('./controllers/currencies.ctrl');
const currencyPairController = require('./controllers/currency-pairs.ctrl');
const customerController = require('./controllers/customers.ctrl');
const jwtAuth = require('./shared/jwt_auth.js');
const auth = require('./shared/auth');
const crypt = require('./shared/crypt');
const jwt = jwtAuth.jwt;
const jwtSecret = jwtAuth.jwtOptions.secretOrKey;
const passport = jwtAuth.passport;

function routes(app) {
  app.get('/', (req, res) => {
    res.status(200).json('Core API online');
  });

  // General ENPOINTS
  app.get('/secretRoute', (req, res) => {
    res.status(200).json({
      message: 'Kawabanga',
      status: true
    });
  });

  app.post('/hp', (req, res) => {
    const pass = req.body.pass;
    crypt.hashPassword(pass).then(hash => {
      res.status(200).json({
        data: hash
      });
    });
  });

  app.post(
    '/testRoute',
    passport.authenticate('jwt', {
      session: false
    }),
    (req, res) => {
      res.status(200).json({
        message: 'The Cake Is A Lie!!!',
        status: true
      });
    }
  );

  // USER CRUD Endpoints
  app.post('/users/login', (req, res) => {
    const params = req.body;
    console.log(params);

    function isJSON(json) {
      try {
        JSON.parse(json);
        return true;
      } catch (error) {
        return false;
      }
    }
    // type check

    if (
      !params.email instanceof String ||
      !params.password instanceof String ||
      (params.email === null || params.email === undefined) ||
      (params.password === null || params.password === undefined) ||
      isJSON(params)
    ) {
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      usersController
        .login(params)
        .then(result => {
          if (result.status === true) {
            const token = jwt.sign({
                email: req.body.email
              },
              jwtSecret
            );
            res.status(200).json({
              message: 'Login Successful',
              status: true,
              data: result.data,
              token: token
            });
          } else {
            // bad login
            res.status(401).json({
              message: 'login failed',
              status: false
            });
          }
        })
        .catch(error => {
          res.status(401).json({
            message: 'failed',
            status: false
          });
        });
    }
  });

  app.post('/users/create', (req, res) => {
    const user = req.body.user;

    if (user == null || user == undefined || typeof user != 'object') {
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      usersController
        .create(user)
        .then(result => {
          if (result.status === true) {
            res.status(200).json({
              message: 'successful',
              status: true,
              data: result.data
            });
          } else {
            res.status(400).json({
              status: false,
              message: result.message
            });
          }
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            message: 'failed',
            status: false
          });
        });
    }
  });

  app.post('/users/update', (req, res) => {
    const user = req.body.user;

    if (user == null || user == undefined || typeof user != 'object') {
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      usersController
        .update(user)
        .then(result => {
          if (result.status === false || result.status === undefined) {
            res.status(500).json({
              message: 'failed',
              status: false
            });
          } else {
            res.status(200).json({
              message: 'Success',
              status: true
            });
          }
        })
        .catch(error => {
          res.status(500).json({
            message: 'failed',
            status: false
          });
        });
    }
  });

  app.post('/users/delete', (req, res) => {
    const user = req.body.user;
    user['active'] = false;

    if (user == null || user == undefined || typeof user != 'object') {
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      usersController
        .update(user)
        .then(result => {
          if (result.status === false || result.status === undefined) {
            res.status(500).json({
              message: 'failed',
              status: false
            });
          } else {
            res.status(200).json({
              message: 'Success',
              status: true
            });
          }
        })
        .catch(error => {
          res.status(500).json({
            message: 'failed',
            status: false
          });
        });
    }
  });

  app.post('/users/findByOrg', (req, res) => {
    const orgCode = req.body.org;

    if (orgCode == null || orgCode == undefined || typeof orgCode != 'string') {
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      usersController
        .getByOrgCode(orgCode)
        .then(result => {
          if (result.status === true) {
            res.status(200).json({
              status: true,
              data: result.data
            });
          } else {
            res.status(404).json({
              status: false,
              message: 'none found'
            });
          }
        })
        .catch(error => {
          res.status(500).json({
            message: 'failed',
            status: false
          });
        });
    }
  });

  // Transactions Endpoints

  // TODO - Add the org member check
  app.post('/transactions/create', (req, res) => {
    const transaction = req.body.transaction;

    if (transaction == null || transaction == undefined || typeof transaction != 'object') {
      console.log();
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      transactionsController
        .create(transaction)
        .then(result => {
          if (result.status === true) {
            res.status(200).json({
              message: 'create successful',
              status: true,
              data: result
            });
          } else {
            res.status(404).json({
              status: false,
              message: 'failed'
            });
          }
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            message: 'failed',
            status: false
          });
        });
    }
  });

  app.post('/transactions/getByID', (req, res) => {
    const id = req.body.id;
    console.log(typeof id);
    if (id == null || id == undefined || typeof id != 'string') {
      res.status(401).json({
        message: 'malformed request',
        status: false
      });
    } else {
      transactionsController
        .getTransactionsByUser(id)
        .then(result => {
          res.status(200).json({
            message: 'get successful',
            status: true,
            data: result
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'get error',
            status: false
          });
        });
    }
  });

  app.post('/transactions/delete', (req, res) => {
    if (userInfo == null || userInfo == undefined || typeof userInfo != 'object') {
      res.status(401).json({
        message: 'malformed request'
      });
    } else {
      transactionsController
        .removeTransactions(userInfo)
        .then(result => {
          res.status(200).json({
            message: 'update successful',
            status: true
          });
        })
        .catch(error => {
          res.status(500).json({
            message: 'update error',
            status: false
          });
        });
    }
  });

  app.post('/transactions/getOrgTransactions', (req, res) => {
    const code = req.body.code;
    const type = req.body.type || 'buy';

    if (code == null || code == undefined || typeof code != 'string') {
      console.log(req.body.code);
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      transactionsController
        .getTransactionsByOrg(code, type)
        .then(result => {
          res.status(200).json({
            message: 'get successful',
            status: true,
            data: result
          });
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            message: 'failed',
            status: false
          });
        });
    }
  });

  // Organisation Endpoints

  app.post('/orgs/create', (req, res) => {
    const org = req.body.org;

    if (org === null || org === undefined) {
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      organisationsController
        .create(org)
        .then(result => {
          if (result.status === false || result.status === undefined) {
            res.status(500).json({
              message: result.message,
              status: false
            });
          } else {
            res.status(200).json({
              message: 'create successful',
              status: true
            });
          }
        })
        .catch(error => {
          console.log('Error: ', error);
          res.status(500).json({
            message: 'failed',
            status: false
          });
        });
    }
  });

  app.get('/orgs/getAll', (req, res) => {
    organisationsController
      .getAll()
      .then(result => {
        if (result.status === false || result.status === undefined) {
          res.status(500).json({
            message: 'failed',
            status: false
          });
        } else {
          res.status(200).json({
            message: 'get successful',
            status: true,
            data: result
          });
        }
      })
      .catch(error => {
        console.log('Error: ', error);
        res.status(500).json({
          message: 'failed',
          status: false
        });
      });
  });

  app.post('/orgs/getByCode', (req, res) => {
    const code = req.body.code;

    if (code == null || code == undefined || typeof code != 'object') {
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      organisationsController
        .getOrganisationByCode(code)
        .then(result => {
          if (result.status === false || result.status === undefined) {
            res.status(500).json({
              message: 'failed',
              status: false
            });
          } else {
            res.status(200).json({
              message: 'get successful',
              status: true,
              data: result
            });
          }
        })
        .catch(error => {
          console.log('Error: ', error);
          res.status(500).json({
            message: 'failed',
            status: false
          });
        });
    }
  });

  app.post('/orgs/update', (req, res) => {
    const org = req.body.org;
    if (org == null || org == undefined) {
      res.status(401).json({
        message: 'malformed request',
        status: false
      });
    } else {
      organisationsController
        .update(org)
        .then(result => {
          if (result.status === false || result.status === undefined) {
            res.status(500).json({
              message: 'failed',
              status: false
            });
          } else {
            res.status(200).json({
              message: 'update successful',
              status: true
            });
          }
        })
        .catch(error => {
          res.status(500).json({
            message: 'get error',
            status: false
          });
        });
    }
  });

  app.post('/orgs/delete', (req, res) => {
    const org = req.body.org;
    if (org == null || org == undefined || typeof org != 'object') {
      res.status(401).json({
        message: 'malformed request'
      });
    } else {
      organisationsController
        .update(org)
        .then(result => {
          if (result.status === false || result.status === undefined) {
            res.status(500).json({
              message: 'failed',
              status: false
            });
          } else {
            res.status(200).json({
              message: 'delete successful',
              status: true
            });
          }
        })
        .catch(error => {
          res.status(500).json({
            message: 'delete error',
            status: false
          });
        });
    }
  });

  app.get('/orgs/getCodeList', (req, res) => {
    organisationsController
      .getOrgsAndCodes()
      .then(result => {
        if (result.status === false || result.status === undefined) {
          res.status(500).json({
            message: 'failed',
            status: false
          });
        } else {
          res.status(200).json({
            message: 'get successful',
            status: true,
            data: result.data
          });
        }
      })
      .catch(error => {
        console.log('Error: ', error);
        res.status(500).json({
          message: 'failed',
          status: false
        });
      });
  });

  // Currencies Endpoints

  app.post('/currencies/getByOrg', (req, res) => {
    const user = req.body.user;

    if (user == null || user == undefined || typeof user != 'object') {
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      auth.isOrgUser(user._id, user.org).then(next => {
        if (next === true) {
          currenciesController
            .getByOrg(user)
            .then(result => {
              res.status(200).json({
                message: 'get successful',
                status: true,
                data: result
              });
            })
            .catch(error => {
              console.log('Error: ', error);
              res.status(500).json({
                message: 'failed',
                status: false
              });
            });
        } else {
          // not authed
          res.status(401).json({
            message: 'unauthorised action for user',
            status: false
          });
        }
      });
    }
  });

  app.post('/currencies/upsert', (req, res) => {
    const user = req.body.user;
    const currency = req.body.currency;

    if (user == null || user == undefined || typeof user != 'object') {
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      auth.isOrgAdmin(user._id, user.organisation._id).then(next => {
        if (next === true) {
          currenciesController
            .upsert(currency)
            .then(result => {
              res.status(200).json({
                message: 'successful',
                status: true
              });
            })
            .catch(error => {
              console.log('Error: ', error);
              res.status(500).json({
                message: 'failed',
                status: false
              });
            });
        } else {
          // not authed
          res.status(401).json({
            message: 'unauthorised action for user',
            status: false
          });
        }
      });
    }
  });

  app.post('/currencies/create', (req, res) => {
    const currency = req.body.currency;

    if (currency == null || currency == undefined || typeof currency != 'object') {
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      auth.isOrgAdmin(currency.creator, currency.org).then(next => {
        if (next === true) {
          currenciesController
            .create(currency)
            .then(result => {
              res.status(200).json({
                message: 'successful',
                status: true
              });
            })
            .catch(error => {
              console.log('Error: ', error);
              res.status(500).json({
                message: 'failed',
                status: false
              });
            });
        } else {
          // not authed
          res.status(401).json({
            message: 'Unauthorised action for user',
            status: false
          });
        }
      });
    }
  });

  // Currency Pairs endpoints
  app.post('/currency-pairs/getByOrg', (req, res) => {
    const user = req.body.user;

    if (user == null || user == undefined || typeof user != 'object') {
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      auth.isOrgUser(user._id, user.org).then(next => {
        if (next === true) {
          currencyPairController
            .getByOrg(user.org)
            .then(result => {
              res.status(200).json({
                message: 'get successful',
                status: true,
                data: result.data
              });
            })
            .catch(error => {
              console.log('Error: ', error);
              res.status(500).json({
                message: 'failed',
                status: false
              });
            });
        } else {
          // not authed
          res.status(401).json({
            message: 'unauthorised action for user',
            status: false
          });
        }
      });
    }
  });

  app.post('/currency-pairs/create', (req, res) => {
    const currencyPair = req.body.currencyPair;

    if (currencyPair === null || currencyPair === undefined || typeof currencyPair != 'object') {
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      auth.isOrgAdmin(currencyPair.creator, currencyPair.org).then(next => {
        if (next === true) {
          delete currencyPair._id;
          currencyPairController
            .create(currencyPair)
            .then(result => {
              if (result.status === true) {
                res.status(200).json({
                  message: 'successful',
                  status: true,
                  data: result.data
                });
              } else {
                res.status(500).json({
                  message: 'failed',
                  status: false
                });
              }

            })
            .catch(error => {
              console.log('Error: ', error);
              res.status(500).json({
                message: 'failed',
                status: false
              });
            });
        } else {
          // not authed
          res.status(401).json({
            message: 'unauthorised action for user',
            status: false
          });
        }
      });
    }
  });

  app.post('/currency-pairs/upsert', (req, res) => {
    const currencyPair = req.body.currencyPair;

    if (currencyPair === null || currencyPair === undefined || typeof currencyPair != 'object') {
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      auth.isOrgAdmin(currencyPair.creator, currencyPair.org).then(next => {
        if (next === true) {
          delete currencyPair._id;
          currencyPairController
            .upsert(currencyPair)
            .then(result => {
              if (result.status === true) {
                res.status(200).json({
                  message: 'successful',
                  status: true,
                  data: result.data
                });
              } else {
                res.status(500).json({
                  message: 'failed',
                  status: false
                });
              }

            })
            .catch(error => {
              console.log('Error: ', error);
              res.status(500).json({
                message: 'failed',
                status: false
              });
            });
        } else {
          // not authed
          res.status(401).json({
            message: 'unauthorised action for user',
            status: false
          });
        }
      });
    }
  });

  app.get('/currency-pairs/getAll', (req, res) => {
    currencyPairController
      .getAll()
      .then(result => {
        if (result.status === false || result.status === undefined) {
          res.status(500).json({
            message: 'failed',
            status: false
          });
        } else {
          res.status(200).json({
            message: 'get successful',
            status: true,
            data: result.data
          });
        }
      })
      .catch(error => {
        console.log('Error: ', error);
        res.status(500).json({
          message: 'failed',
          status: false
        });
      });
  });

  // Customer endpoints
  app.post('/customer/getByOrg', (req, res) => {
    const user = req.body.user;

    if (user == null || user == undefined || typeof user != 'object') {
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      auth.isOrgUser(user._id, user.org).then(next => {
        if (next === true) {
          customerController
            .getByOrg(user.org)
            .then(result => {
              res.status(200).json({
                message: 'get successful',
                status: true,
                data: result.data
              });
            })
            .catch(error => {
              console.log('Error: ', error);
              res.status(500).json({
                message: 'failed',
                status: false
              });
            });
        } else {
          // not authed
          res.status(401).json({
            message: 'unauthorised action for user',
            status: false
          });
        }
      });
    }
  });

  app.post('/customer/upsert', (req, res) => {
    const customer = req.body.customer;

    if (customer === null || customer === undefined || typeof customer != 'object') {
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      auth.isOrgAdmin(customer.creator, customer.org).then(next => {
        if (next === true) {
          currencyPairController
            .upsert(customer)
            .then(result => {
              if (result.status === true) {
                res.status(200).json({
                  message: 'successful',
                  status: true,
                  data: result.data
                });
              } else {
                res.status(500).json({
                  message: 'failed',
                  status: false
                });
              }

            })
            .catch(error => {
              console.log('Error: ', error);
              res.status(500).json({
                message: 'failed',
                status: false
              });
            });
        } else {
          // not authed
          res.status(401).json({
            message: 'unauthorised action for user',
            status: false
          });
        }
      });
    }
  });

  app.post('/customer/getByCode', (req, res) => {
    const customer = req.body.customer;

    if (customer == null || customer == undefined || typeof customer != 'object') {
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      auth.isOrgUser(customer.userId, customer.org)
        .then(next => {
          if (next === true) {
            customerController
              .getByCode(customer.code)
              .then(result => {
                res.status(200).json({
                  message: 'get successful',
                  status: true,
                  data: result.data
                });
              })
              .catch(error => {
                console.log('Error: ', error);
                res.status(500).json({
                  message: 'failed',
                  status: false
                });
              });
          } else {
            // not authed
            res.status(401).json({
              message: 'unauthorised action for user',
              status: false
            });
          }
        });
    }
  });

  app.post('/customer/getById', (req, res) => {
    const customer = req.body.customer;

    if (customer == null || customer == undefined || typeof customer != 'object') {
      res.status(400).json({
        message: 'malformed request',
        status: false
      });
    } else {
      auth.isOrgUser(customer.creator, customer.org)
        .then(next => {
          if (next === true) {
            customerController
              .getByID(customer.idType, customer.idNumber)
              .then(result => {
                res.status(200).json({
                  message: 'get successful',
                  status: true,
                  data: result.data
                });
              })
              .catch(error => {
                console.log('Error: ', error);
                res.status(500).json({
                  message: 'failed',
                  status: false
                });
              });
          } else {
            // not authed
            res.status(401).json({
              message: 'unauthorised action for user',
              status: false
            });
          }
        });
    }
  });
}

module.exports.routes = routes;