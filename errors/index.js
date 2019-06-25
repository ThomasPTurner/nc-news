exports.handleWithCode = (err, req, res, next) => {
    res.status(err.code).send(err)
}
exports.handle500 = (err, req, res, next) => {
    console.log(err)
    res.status(500).send({code: 500, msg: 'interal server error'})
}


//controller
exports.catchAll404 = (req,res,next) => {
    next({code: 404, msg:'Page not found'})
}