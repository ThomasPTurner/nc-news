exports.handle404 = (err, req, res, next) => {
    res.status(err.code).send(err)
}