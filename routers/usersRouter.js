const express = require('express');
const { getUsers, getUserById } = require('../controllers/');
const usersRouter = express.Router();
const { badMethod } = require('../errors')

usersRouter.route('/')
    .get(getUsers)
    .all(badMethod)

usersRouter.route('/:user_id')
    .get(getUserById)
    .all(badMethod)

module.exports =  usersRouter;
