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
    it("should return created response", async () => {
        const req = { body: { discordId: "123", username: 'test' } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        userService.insertUser.mockResolvedValue({ id: 1, discordId: "123" });
        await userController.createUser(req, res);

        expect(userService.insertUser).toHaveBeenCalledWith("123", 'test');

        expect(createCreatedResponse).toHaveBeenCalledWith(res, {
            id: 1,
            discordId: "123"
        });
    });

    it('should return bad request response', async () => {
        const req = { body: {} }
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        await userController.createUser(req, res);

        expect(createBadRequestResponse).toHaveBeenCalledWith(res, "No DiscordId and Username given");
    });

    it("should handle errors", async () => {
        const req = { body: { discordId: "123", username: "test" } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        const error = new Error("fail");
        userService.insertUser.mockRejectedValue(error);

        await userController.createUser(req, res);

        expect(createInternalServerResponse).toHaveBeenCalledWith(res, error);
    });
});

describe("getUserBalance", () => {
    it('should return ok response', async () => {
        const req = { query: { discordId: "123", username: "test" } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        userService.selectUserBalance.mockResolvedValue( { discordId: "123", balance: 0 } );
        await userController.getUserBalance(req, res);

        expect(userService.selectUserBalance).toHaveBeenCalledWith("123", "test");
        expect(createOKResponse).toHaveBeenCalledWith(res, { discordId: "123", balance: 0 });
    });

    it('should return bad request response', async () => {
        const req = { query: {} };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        userService.selectUserBalance.mockResolvedValue({});
        await userController.getUserBalance(req, res);

        expect(createBadRequestResponse).toHaveBeenCalledWith(res, "No DiscordId and Username given")
    });

    it('should return not found response', async () => {
        const req = { query: { discordId: "123", username: "test" } };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        userService.selectUserBalance.mockResolvedValue();
        await userController.getUserBalance(req, res);

        expect(createNotFoundResponse).toHaveBeenCalledWith(res, "User Not Found");
    });

    it('should handle errors', async () => {
        const req = { query: { discordId: "123", username: "test" }};
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        const error = new Error("error");
        userService.selectUserBalance.mockRejectedValue(error);

        await userController.getUserBalance(req, res);

        expect(createInternalServerResponse).toHaveBeenCalledWith(res, error);
    });
});

describe("addUserBalance", () => {
    it('should return ok response', async () => {
        const req = { body: { discordId: "123", username: "test", sum: 10 }};
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        userService.updateUserBalance.mockResolvedValue({ discordId: "123", sum: 10 });
        await userController.addUserBalance(req, res);

        expect(userService.updateUserBalance).toHaveBeenCalledWith("123", "test", 10);
        expect(createOKResponse).toHaveBeenCalledWith(res, { discordId: "123", sum: 10 });
    });

    it('should return bad request response', async () => {
        const req = { body: {} };
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        userService.updateUserBalance.mockResolvedValue();
        await userController.addUserBalance(req, res);

        expect(createBadRequestResponse).toHaveBeenCalledWith(res, "No DiscordId and Username given");
    });

    it('should return not found response', async () => {
        const req = { body: { discordId: "123", username: "test", sum: 10 }};
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        userService.updateUserBalance.mockResolvedValue();
        await userController.addUserBalance(req, res);

        expect(createNotFoundResponse).toHaveBeenCalledWith(res, "User Not Found");
    });

    it('should handle errors', async () => {
        const req = { body: { discordId: "123", username: "test", sum: 10 }};
        const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };

        const error = new Error("error");
        userService.updateUserBalance.mockRejectedValue(error);
        await userController.addUserBalance(req, res);

        expect(createInternalServerResponse).toHaveBeenCalledWith(res, error);
    });
});