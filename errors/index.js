exports.handleWithCode = (err, req, res, next) => {
    if(err.code) res.status(err.code).send(err)
    else next(err)
}
exports.handle500 = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({code: 500, msg: 'interal server error'})
}
exports.handlePGerrors = (err, req, res, next) => {
    const pgErrArr = ['22P02', '23503']
    if (pgErrArr.includes(err.code)) {
        if (err.code === '23503') res.status(400).send({code: 404, msg: 'dependant resource not found'})
        else res.status(400).send({code: 400, msg: 'bad request'})
    } else next(err)
}

//controller
exports.catchAll404 = (req,res,next) => {
    next({code: 404, msg:'Page not found'})
}