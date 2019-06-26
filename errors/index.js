exports.handleWithCode = (err, req, res, next) => {
    if(err.code) res.status(err.code).send(err)
    else next(err)
}
exports.handle500 = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({code: 500, msg: 'interal server error'})
}
exports.handlePGerrors = (err, req, res, next) => {
    const pgErrArr = ['22P02', '23503', '22001']
    if (pgErrArr.includes(err.code)) {
        const refObj = {
            ['22P02']: {code: 400, msg: 'bad request'},
            ['23503']: {code: 404, msg: 'dependant resource not found'},
            ['22001']: {code: 400, msg: 'bad input'}
        }
        res.status(refObj[err.code].code).send(refObj[err.code])
    }
    else next(err)
}

//controller
exports.catchAll404 = (req,res,next) => {
    next({code: 404, msg:'Page not found'})
}