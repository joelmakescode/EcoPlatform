const { selectUserByDiscordId, insertDiscordUser, updatePasswordHash, updateLanguage, updateAutofill, updateDailyClaim} = require('../services/discordUser.service');
const { createOKResponse, createNotFoundResponse, createBadRequestResponse, createInternalServerResponse, createCreatedResponse, createConflictResponse,
    createTooManyRequestsResponse
} = require('../services/handler/status.handler');
const {updateUserBalance} = require("../services/user.service");

const err = {
    ErrAutofillNotGiven:        "No Autofill Given",
    ErrAutofillAlreadyChosen:   "Autofill Already Chosen By User",
    ErrDailyClaimNotAvailable:  "Daily Claim Not Available Yet",
    ErrDiscordIdNotGiven:       "No DiscordId Given",
    ErrDiscordUserNotFound:     "Discord User Not Found",
    ErrLanguageAlreadyChosen:   "Language Already Chosen By User",
    ErrLanguageNotGiven:        "No Language Given",
    ErrPasswordHashNotGiven:    "No Password Hash Given",
    ErrUserExists:              "User Already Exists"
};

async function createDiscordUser(req, res) {
    try {
        const { discordId, passwordHash } = req.body;

        const userData = await selectUserByDiscordId(discordId);
        if (userData) {
            return createConflictResponse(res, err.ErrUserExists);
        }

        const newUser = await insertDiscordUser(discordId, passwordHash);

        createCreatedResponse(res, newUser);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

async function getUserByDiscordId(req, res) {
    try {
        const { discordId } = req.params;

        if (!discordId) {
            return createBadRequestResponse(res, err.ErrDiscordIdNotGiven);
        }

        const discordUserData = await selectUserByDiscordId(discordId);
        if (!discordUserData) {
            return createNotFoundResponse(res, err.ErrDiscordUserNotFound);
        }

        createOKResponse(res, discordUserData);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

async function updateDiscordUserAutofill(req, res) {
    try {
        const { discordId, autofill } = req.body;

        if (!discordId) {
            return createBadRequestResponse(res, err.ErrDiscordIdNotGiven);
        }
        if (!autofill) {
            return createBadRequestResponse(res, err.ErrAutofillNotGiven);
        }

        const discordUserData = await selectUserByDiscordId(discordId);
        if (!discordUserData) {
            createNotFoundResponse(res, err.ErrDiscordUserNotFound);
        }
        if (discordUserData.autofill === autofill) {
            return createBadRequestResponse(res, err.ErrAutofillAlreadyChosen);
        }

        const updatedUser = await updateAutofill(discordId, autofill);
        
        createOKResponse(res, updatedUser);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

async function updateDiscordUserLanguage(req, res) {
    try {
        const { discordId, language } = req.body;

        if (!discordId) {
            return createBadRequestResponse(res, err.ErrDiscordIdNotGiven);
        }
        if (!language) {
            return createBadRequestResponse(res, err.ErrLanguageNotGiven);
        }

        const discordUserData = await selectUserByDiscordId(discordId);
        if (!discordUserData) {
            return createNotFoundResponse(res, err.ErrDiscordUserNotFound);
        }
        if (discordUserData.language === language) {
            return createBadRequestResponse(res, err.ErrLanguageAlreadyChosen);
        }

        const updatedUser = await updateLanguage(discordId, language);

        createOKResponse(res, updatedUser);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

async function updateDiscordUserPasswordHash(req, res) {
    try {
        const { discordId, passwordHash } = req.body;

        if (!discordId) {
            return createBadRequestResponse(res, err.ErrDiscordIdNotGiven);
        }
        if (!passwordHash) {
            return createBadRequestResponse(res, err.ErrPasswordHashNotGiven)
        }

        const discordUserData = await selectUserByDiscordId(discordId);
        if (!discordUserData) {
            return createNotFoundResponse(res, err.ErrDiscordUserNotFound);
        }

        const updatedUser = await updatePasswordHash(discordId, passwordHash);

        createOKResponse(res, updatedUser);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

async function updateDiscordUserDailyClaim(req, res) {
    try {
        const { discordId } = req.body;
        if (!discordId) {
            return createBadRequestResponse(res, err.ErrDiscordIdNotGiven);
        }

        const discordUserData = await selectUserByDiscordId(discordId);
        if (!discordUserData) {
            return createNotFoundResponse(res, err.ErrDiscordUserNotFound);
        }

        if (Date.now() - discordUserData.daily_claim < 24 * 60 * 60 * 1000) {
            return createTooManyRequestsResponse(res, err.ErrDailyClaimNotAvailable);
        }

        const updatedUser = await updateUserBalance(discordId, null, 10);
        await updateDailyClaim(discordId);

        if (!updatedUser) {
            createInternalServerResponse(res, updatedUser.info)
        }

        createOKResponse(res, updatedUser);
    } catch(error) {
        createInternalServerResponse(res, error);
    }
}

module.exports = { createDiscordUser, getUserByDiscordId, updateDiscordUserAutofill, updateDiscordUserLanguage, updateDiscordUserPasswordHash, updateDiscordUserDailyClaim };