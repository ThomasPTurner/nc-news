exports.handleWithCode = (err, req, res, next) => {
    if(err.code) res.status(err.code).send(err)
    else next(err)
}
exports.handle500 = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({code: 500, msg: 'interal server error'})
}
exports.handlePGerrors = (err, req, res, next) => {
    const errRefObj = {
        ['22P02']: {code: 400, msg: 'bad request'},
        ['23503']: {code: 404, msg: 'dependant resource not found'},
        ['22001']: {code: 400, msg: 'bad input'},
        ['42703']: {code: 400, msg: 'bad request'}
    }
    if (errRefObj[err.code]) {
        res.status(errRefObj[err.code].code).send(errRefObj[err.code])
    }
    else next(err)
}

//controller
exports.catchAll404 = (req,res,next) => {
    next({code: 404, msg:'Page not found'})
}