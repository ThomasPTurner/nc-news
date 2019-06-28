const  { fetchUsers, fetchUserById }  = require('../models');
const { rejectEmptyArr } = require('../db/utils/utils');

const getUsers = (req, res, next) => fetchUsers()
        .then((users)=> res.status(200).send({users}))
        .catch(next);


const getUserById = ({params: {user_id}}, res, next)=> fetchUserById(user_id)
        .then(rejectEmptyArr)
        .then(([user]) => res.status(200).send({user}))
        .catch(next);

module.exports = { getUsers, getUserById }
