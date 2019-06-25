const  { fetchUsers }  = require('../models')
const getUsers = (req, res, next) => {
    return fetchUsers()
        .then((users)=>{
            res.status(200).send({users})
        })
        .catch(next)
}

module.exports = { getUsers }
