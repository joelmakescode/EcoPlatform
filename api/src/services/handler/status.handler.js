function createOKResponse(res, data) {
    res.status(200).json({ data: data });
}

function createCreatedResponse(res, data) {
    res.status(201).json({ data: data });
}

function createBadRequestResponse(res, message) {
    res.status(400).json({ error: message });
}

function createNotFoundResponse(res, message) {
    res.status(404).json({ error: message });
}

function createInternalServerResponse(res, error) {
    console.error(error);

    res.status(500).json({ error: error });
}

module.exports = { createOKResponse, createCreatedResponse, createBadRequestResponse, createNotFoundResponse, createInternalServerResponse };