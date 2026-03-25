jest.mock("../../../src/services/handler/status.handler", () => ({
    createCreatedResponse: jest.fn(),
    createInternalServerResponse: jest.fn(),
    createBadRequestResponse: jest.fn(),
    createOKResponse: jest.fn(),
    createNotFoundResponse: jest.fn(),
    createConflictResponse: jest.fn()
}));

jest.mock("../../../src/services/discordUser.service", () => ({
    selectUserByDiscordId: jest.fn(),
    insertDiscordUser: jest.fn(),
    updateAutofill: jest.fn(),
    updateLanguage: jest.fn(),
    updatePasswordHash: jest.fn()
}));

const discordUserController = require("../../../src/controllers/discordUser.controller");
const discordUserService = require("../../../src/services/discordUser.service");

const {
    createCreatedResponse,
    createInternalServerResponse,
    createBadRequestResponse,
    createNotFoundResponse,
    createOKResponse,
    createConflictResponse
} = require('../../../src/services/handler/status.handler');

beforeEach(() => {
    jest.resetAllMocks();
});

describe("createDiscordUser", () => {
    let req = { body: { discordId: 123, passwordHash: "testpw" }}
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    it('should return created response', async () => {
        discordUserService.insertDiscordUser.mockResolvedValue({ id: 1, info: "OK", discordId: 123 });
        await discordUserController.createDiscordUser(req, res);

        expect(createCreatedResponse).toHaveBeenCalledWith(res, { id: 1, info: "OK", discordId: 123 });
    });

    it('should return conflict response', async () => {
        discordUserService.selectUserByDiscordId.mockResolvedValue({ discordId: 123 });
        await discordUserController.createDiscordUser(req, res);

        expect(createConflictResponse).toHaveBeenCalledWith(res, discordUserController.err.ErrUserExists);
    });

    it('should handle errors', async () => {
        const error = new Error("error");
        discordUserService.insertDiscordUser.mockRejectedValue(error);
        await discordUserController.createDiscordUser(req, res);

        expect(createInternalServerResponse).toHaveBeenCalledWith(res, error);
    });

    // 400 at the end so body can be empty
    it('should return bad request response when discordId missing', async () => {
        req = { body: { discordId: "", passwordHash: "testpw"} };
        await discordUserController.createDiscordUser(req, res);

        expect(createBadRequestResponse).toHaveBeenCalledWith(res, discordUserController.err.ErrDiscordIdNotGiven)
    });

    it('should return bad request response when passwordHash missing', async () => {
        req = { body: { discordId: "123", passwordHash: "" }};
        await discordUserController.createDiscordUser(req, res);

        expect(createBadRequestResponse).toHaveBeenCalledWith(res, discordUserController.err.ErrPasswordHashNotGiven);
    });
});

describe("selectUserByDiscordId", () => {
    let req = { params: { discordId: 123 }};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    const userResolvedValue = { id: 1, discord_id: 123, password_hash: "testpw", language: "en", autofill: 0 };

    it('should return ok response', async () => {
        discordUserService.selectUserByDiscordId.mockResolvedValue(userResolvedValue);
        await discordUserController.getUserByDiscordId(req, res);

        expect(createOKResponse).toHaveBeenCalledWith(res, userResolvedValue);
    });

    it('should return not found response', async () => {
        await discordUserController.getUserByDiscordId(req, res);

        expect(createNotFoundResponse).toHaveBeenCalledWith(res, discordUserController.err.ErrDiscordUserNotFound);
    });

    it('should handle errors', async () => {
        const error = new Error("error");
        discordUserService.selectUserByDiscordId.mockRejectedValue(error);
        await discordUserController.getUserByDiscordId(req, res);

        expect(createInternalServerResponse).toHaveBeenCalledWith(res, error)
    });

    // 400 at the end so query can be empty
    it('should return bad request response', async () => {
        req = { params: {} };
        await discordUserController.getUserByDiscordId(req, res);

        expect(createBadRequestResponse).toHaveBeenCalledWith(res, discordUserController.err.ErrDiscordIdNotGiven);
    });
});

describe("updateDiscordUserAutofill", () => {
    let req = { body: { discordId: 123, autofill: 1 }};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    const userResolvedValue = { discordId: 123, autofill: 1 };
    const userSelectResolvedValue = { discordId: 123, autofill: 0 };

    it('should return ok response', async () => {
        discordUserService.selectUserByDiscordId.mockResolvedValue(userSelectResolvedValue);
        discordUserService.updateAutofill.mockResolvedValue(userResolvedValue);
        await discordUserController.updateDiscordUserAutofill(req, res);

        expect(createOKResponse).toHaveBeenCalledWith(res, userResolvedValue);
    });

    it('should return not found response', async () => {
        await discordUserController.updateDiscordUserAutofill(req, res);

        expect(createNotFoundResponse).toHaveBeenCalledWith(res, discordUserController.err.ErrDiscordUserNotFound);
    });

    it('should return conflict response', async () => {
        discordUserService.selectUserByDiscordId.mockResolvedValue(userResolvedValue);
        await discordUserController.updateDiscordUserAutofill(req, res);

        expect(createConflictResponse).toHaveBeenCalledWith(res, discordUserController.err.ErrAutofillAlreadyChosen);
    });

    it('should handle errors', async () => {
        const error = new Error("error");
        discordUserService.selectUserByDiscordId.mockRejectedValue(error);
        await discordUserController.updateDiscordUserAutofill(req, res);

        expect(createInternalServerResponse).toHaveBeenCalledWith(res, error);
    });

    // 400 at the end so body can be empty
    it('should return bad request response', async () => {
        req = { body: {} };
        await discordUserController.updateDiscordUserAutofill(req, res);

        expect(createBadRequestResponse).toHaveBeenCalledWith(res, discordUserController.err.ErrDiscordIdNotGiven);
    });
});

describe("updateDiscordUserLanguage", () => {
   let req = { body: { discordId: 123, language: "en" }};
   const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
   const userResolvedValue = { discordId: 123, language: "en" };
   const userSelectResolvedValue = { discordId: 123, language: "de" };

    it('should return ok response', async () => {
        discordUserService.selectUserByDiscordId.mockResolvedValue(userSelectResolvedValue);
        discordUserService.updateLanguage.mockResolvedValue(userResolvedValue);
        await discordUserController.updateDiscordUserLanguage(req, res);

        expect(createOKResponse).toHaveBeenCalledWith(res, userResolvedValue);
    });

    it('should return not found response', async () => {
        await discordUserController.updateDiscordUserLanguage(req, res);

        expect(createNotFoundResponse).toHaveBeenCalledWith(res, discordUserController.err.ErrDiscordUserNotFound);
    });

    it('should return conflict response', async () => {
        discordUserService.selectUserByDiscordId.mockResolvedValue(userResolvedValue);
        await discordUserController.updateDiscordUserLanguage(req, res);

        expect(createConflictResponse).toHaveBeenCalledWith(res, discordUserController.err.ErrLanguageAlreadyChosen);
    });

    it('should handle errors', async () => {
        const error = new Error("error");
        discordUserService.selectUserByDiscordId.mockRejectedValue(error);
        await discordUserController.updateDiscordUserLanguage(req, res);

        expect(createInternalServerResponse).toHaveBeenCalledWith(res, error);
    });

    // 400 at the end so body can be empty
    it('should return bad request response', async () => {
        req = { body: {} };
        await discordUserController.updateDiscordUserLanguage(req, res);

        expect(createBadRequestResponse).toHaveBeenCalledWith(res, discordUserController.err.ErrDiscordIdNotGiven);
    });
});

describe("updateDiscordUserPasswordHash", () => {
   let req = { body: { discordId: 123, passwordHash: "testpw" }};
   const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
   const userResolvedValue = { discordId: 123 };

    it('should return ok response', async () => {
        discordUserService.selectUserByDiscordId.mockResolvedValue(userResolvedValue);
        discordUserService.updatePasswordHash.mockResolvedValue(userResolvedValue);
        await discordUserController.updateDiscordUserPasswordHash(req, res);

        expect(createOKResponse).toHaveBeenCalledWith(res, userResolvedValue);
    });

    it('should return not found response', async () => {
        await discordUserController.updateDiscordUserPasswordHash(req, res);

        expect(createNotFoundResponse).toHaveBeenCalledWith(res, discordUserController.err.ErrDiscordUserNotFound);
    });

    it('should handle errors', async () => {
        const error = new Error("error");
        discordUserService.selectUserByDiscordId.mockRejectedValue(error);
        await discordUserController.updateDiscordUserPasswordHash(req, res);

        expect(createInternalServerResponse).toHaveBeenCalledWith(res, error);
    });

    // 400 at the end so body can be empty
    it('should ', async () => {
        req = { body: {} };
        await discordUserController.updateDiscordUserPasswordHash(req, res);

        expect(createBadRequestResponse).toHaveBeenCalledWith(res, discordUserController.err.ErrDiscordIdNotGiven);
    });
});

