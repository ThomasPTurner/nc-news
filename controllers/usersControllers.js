const  { fetchUsers, fetchUserById }  = require('../models')
const getUsers = (req, res, next) => {
    return fetchUsers()
        .then((users)=>{
            res.status(200).send({users})
        })
        .catch(next)
}

const getUserById = ({params: {user_id}}, res, next)=>{
    return fetchUserById(user_id)
        .then(([user]) => {
           
            if (!user) return Promise.reject({code: 404, msg: 'user not found'})
            res.status(200).send({user});
        })
        .catch(next);
}


module.exports = { getUsers, getUserById }
