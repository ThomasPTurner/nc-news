const express = require('express');
const { postUser, getUsers, getUserById } = require('../controllers/');
const usersRouter = express.Router();
const { badMethod } = require('../errors')

usersRouter.route('/')
    .post(postUser)
    .get(getUsers)
    .all(badMethod)

usersRouter.route('/:user_id')
    .get(getUserById)
    .all(badMethod)

module.exports =  usersRouter;
