const {createInternalServerResponse, createBadRequestResponse, createNotFoundResponse, createOKResponse,
    createConflictResponse, createCreatedResponse, createUnauthorizedResponse
} = require("../services/handler/status.handler");
const {selectEcoplatformUser, insertEcoplatformUser} = require("../services/ecoplatformUser.service");
const {verifyPassword} = require("../services/handler/passwordhash.handler");


const err = {
    ErrNotAllowed: "Not allowed",
    ErrPasswordMissing: "Password missing",
    ErrUsernameMissing: "Username missing",
    ErrUserNotFound: "User not found",
    ErrUserAlreadyExists: "User already exists"
}

async function createEcoplatformUser(req, res) {
    try {
        const { username, password } = req.body;

        if (!username) {
            return createBadRequestResponse(res, err.ErrUsernameMissing);
        }
        if (!password) {
            return createBadRequestResponse(res, err.ErrPasswordMissing);
        }

        const insertedUser = await insertEcoplatformUser(username, password);
        if (!insertedUser) {
            return createConflictResponse(res, err.ErrUserAlreadyExists);
        }

        createCreatedResponse(res, insertedUser);
    } catch(error) {
        createInternalServerResponse(res, error);
    }
}

async function getEcoplatformUser(req, res) {
    try {
        const { username } = req.params;
        if (!username) {
            return createBadRequestResponse(res, err.ErrUsernameMissing);
        }

        const userData = await selectEcoplatformUser(username);
        if (!userData) {
            return createNotFoundResponse(res, err.ErrUserNotFound);
        }

        createOKResponse(res, userData);
    } catch(error){
        createInternalServerResponse(res, error);
    }
}

async function loginEcoplatformUser(req, res) {
    try {
        const { username, password } = req.body;
        if (!username) {
            return createBadRequestResponse(res, err.ErrUsernameMissing);
        }
        if (!password) {
            return createBadRequestResponse(res, err.ErrPasswordMissing);
        }

        const userData = await selectEcoplatformUser(username);
        if (!userData) {
            return createNotFoundResponse(res, err.ErrUserNotFound);
        }
        if (await verifyPassword(password, userData.password_hash)) {
            return createUnauthorizedResponse(res, err.ErrNotAllowed);
        }

        createOKResponse(res, { token: process.env.API_TOKEN });
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}


module.exports = { createEcoplatformUser, getEcoplatformUser, loginEcoplatformUser }