jest.mock("../../../src/services/user.service", () => ({
    insertUser: jest.fn(),
    selectUserBalance: jest.fn(),
    updateUserBalance: jest.fn()
}));

jest.mock("../../../src/services/handler/status.handler", () => ({
    createCreatedResponse: jest.fn(),
    createInternalServerResponse: jest.fn(),
    createBadRequestResponse: jest.fn(),
    createOKResponse: jest.fn(),
    createNotFoundResponse: jest.fn(),
    createConflictResponse: jest.fn()
}));

const userController = require('../../../src/controllers/user.controller');
const userService = require('../../../src/services/user.service');
const {
    createCreatedResponse,
    createInternalServerResponse,
    createBadRequestResponse,
    createNotFoundResponse,
    createOKResponse,
    createConflictResponse
} = require('../../../src/services/handler/status.handler');

describe("createUser", () => {
    let req = { body: { discordId: "123", username: "test" } };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    it("should return created response", async () => {
        userService.insertUser.mockResolvedValue({ id: 1, discordId: "123" });
        await userController.createUser(req, res);

        expect(userService.insertUser).toHaveBeenCalledWith("123", 'test');

        expect(createCreatedResponse).toHaveBeenCalledWith(res, {
            id: 1,
            discordId: "123"
        });
    });

    it("should handle errors", async () => {
        const error = new Error("fail");
        userService.insertUser.mockRejectedValue(error);

        await userController.createUser(req, res);

        expect(createInternalServerResponse).toHaveBeenCalledWith(res, error);
    });

    // 400 at the end so body can be empty
    it('should return bad request response', async () => {
        req = { body: {} }
        await userController.createUser(req, res);

        expect(createBadRequestResponse).toHaveBeenCalledWith(res, userController.err.ErrNoIdAndUsernameGiven);
    });
});

describe("getUserBalance", () => {
    let req = { query: { discordId: "123", username: "test" }};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    it('should return ok response', async () => {
        userService.selectUserBalance.mockResolvedValue( { discordId: "123", balance: 0 } );
        await userController.getUserBalance(req, res);

        expect(userService.selectUserBalance).toHaveBeenCalledWith("123", "test");
        expect(createOKResponse).toHaveBeenCalledWith(res, { discordId: "123", balance: 0 });
    });

    it('should return not found response', async () => {
        userService.selectUserBalance.mockResolvedValue();
        await userController.getUserBalance(req, res);

        expect(createNotFoundResponse).toHaveBeenCalledWith(res, userController.err.ErrUserNotFound);
    });

    it('should handle errors', async () => {
        const error = new Error("error");
        userService.selectUserBalance.mockRejectedValue(error);

        await userController.getUserBalance(req, res);

        expect(createInternalServerResponse).toHaveBeenCalledWith(res, error);
    });

    // 400 At the End so query can be empty
    it('should return bad request response', async () => {
        req = { query: {} };

        userService.selectUserBalance.mockResolvedValue({});
        await userController.getUserBalance(req, res);

        expect(createBadRequestResponse).toHaveBeenCalledWith(res, userController.err.ErrNoIdAndUsernameGiven)
    });
});

describe("addUserBalance", () => {
    let req = { body: { discordId: "123", username: "test", sum: 10 }};
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

    it('should return ok response', async () => {
        userService.updateUserBalance.mockResolvedValue({ discordId: "123", sum: 10 });
        await userController.addUserBalance(req, res);

        expect(userService.updateUserBalance).toHaveBeenCalledWith("123", "test", 10);
        expect(createOKResponse).toHaveBeenCalledWith(res, { discordId: "123", sum: 10 });
    });

    it('should return not found response', async () => {
        userService.updateUserBalance.mockResolvedValue();
        await userController.addUserBalance(req, res);

        expect(createNotFoundResponse).toHaveBeenCalledWith(res, userController.err.ErrUserNotFound);
    });

    it('should handle errors', async () => {
        const error = new Error("error");
        userService.updateUserBalance.mockRejectedValue(error);
        await userController.addUserBalance(req, res);

        expect(createInternalServerResponse).toHaveBeenCalledWith(res, error);
    });

    // 400 at the end so body can be empty
    it('should return bad request response', async () => {
        req = { body: {} };

        userService.updateUserBalance.mockResolvedValue();
        await userController.addUserBalance(req, res);

        expect(createBadRequestResponse).toHaveBeenCalledWith(res, userController.err.ErrNoIdAndUsernameGiven);
    });
});