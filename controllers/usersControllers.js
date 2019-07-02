const  { fetchUsers, fetchUserById, createUser }  = require('../models');
const { rejectEmptyArr } = require('../db/utils/utils');

const getUsers = ({query}, res, next) => fetchUsers(query)
        .then((users)=> res.status(200).send({users}))
        .catch(next);


const getUserById = ({params: {user_id}}, res, next)=> fetchUserById(user_id)
        .then(rejectEmptyArr)
        .then(([user]) => res.status(200).send({user}))
        .catch(next);

const postUser = ({body}, res, next) => {
        createUser(body)
                .then(([user]) => {
                        res.status(201).send({user})
                })
        
}

module.exports = { getUsers, getUserById, postUser }
