const express = require('express');
const { getUsers, getUserById } = require('../controllers/');
const usersRouter = express.Router();
const { badMethod } = require('../errors')

usersRouter.route('/')
    .get(getUsers)
    .post(badMethod)
    .put(badMethod)
    .patch(badMethod)
    .delete(badMethod);

usersRouter.route('/:id')
    .get(getUserById)
    .post(badMethod)
    .put(badMethod)
    .patch(badMethod)
    .delete(badMethod);

module.exports =  usersRouter;
