function createOKResponse(res, data) {
    res.status(200).json({ data });
}

function createCreatedResponse(res, data) {
    res.status(201).json({ data });
}

function createBadRequestResponse(res, message) {
    res.status(400).json({ error: message });
}

function createUnauthorizedResponse(res, message) {
    res.status(401).json({ error: message });
}

function createNotFoundResponse(res, message) {
    res.status(404).json({ error: message });
}

function createConflictResponse(res, message) {
    res.status(409).json({ error: message });
}

function createTooManyRequestsResponse(res, message) {
    res.status(429).json({ error: message });
}

function createInternalServerResponse(res, error) {
    console.error(error);

    res.status(500).json({ error: error });
}

module.exports = { createOKResponse, createCreatedResponse, createBadRequestResponse, createUnauthorizedResponse, createNotFoundResponse, createConflictResponse, createTooManyRequestsResponse, createInternalServerResponse };