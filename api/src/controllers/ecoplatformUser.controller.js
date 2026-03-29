const {createInternalServerResponse, createBadRequestResponse, createNotFoundResponse, createOKResponse,
    createConflictResponse, createCreatedResponse
} = require("../services/handler/status.handler");
const {selectEcoplatformUser, insertEcoplatformUser} = require("../services/ecoplatformUser.service");


const err = {
    ErrPasswordMissing: "Password missing",
    ErrUsernameMissing: "Username missing",
    ErrUserNotFound: "User not found",
    ErrUserAlreadyExists: "User already exists"
}

async function createEcoplatformUser(req, res) {
    try {
        const { username, passwordHash } = req.body;

        if (!username) {
            return createBadRequestResponse(res, err.ErrUsernameMissing);
        }
        if (!passwordHash) {
            return createBadRequestResponse(res, err.ErrPasswordMissing);
        }

        const insertedUser = await insertEcoplatformUser(username, passwordHash);
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


module.exports = { createEcoplatformUser, getEcoplatformUser }