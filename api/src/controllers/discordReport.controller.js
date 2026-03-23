const { createBadRequestResponse, createOKResponse, createInternalServerResponse, createNotFoundResponse, createCreatedResponse } = require("../services/handler/status.handler");
const { insertNewReport, updateReport, selectReportData} = require("../services/discordReport.service");


const err = {
    ErrNoReportDataFound: "No Report Data Found",
    ErrNoMessageIdFound: "No MessageId Found",
    ErrNoMessageIdGiven: "No MessageId Given",
    ErrNoReporterIdGiven: "No ReporterId Given"
};

async function createNewReport(req, res) {
    try {
        const { messageId, reporterId } = req.body;

        if (!messageId) {
            return createBadRequestResponse(res, err.ErrNoMessageIdGiven);
        }
        if (!reporterId) {
            return createBadRequestResponse(res, err.ErrNoReporterIdGiven);
        }

        const newReport = await insertNewReport(messageId, reporterId);
        
        createCreatedResponse(res, newReport);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

async function getReportData(req, res) {
    try {
        const { messageId } = req.params;
        if (!messageId) {
            return createBadRequestResponse(res,err.ErrNoMessageIdGiven);
        }

        const messageData = await selectReportData(messageId);
        if (!messageData) {
            return createNotFoundResponse(res, err.ErrNoReportDataFound);
        }

        createOKResponse(res, messageData);
    } catch(error) {
        createInternalServerResponse(res, error);
    }
}

async function finishReport(req, res) {
    try {
        const { messageId } = req.body;
        if (!messageId) {
            return createBadRequestResponse(res, err.ErrNoMessageIdGiven);
        }

        const updatedReport = await updateReport(messageId);
        if (!updatedReport) {
            return createNotFoundResponse(res, err.ErrNoMessageIdFound);
        }

        createOKResponse(res, updatedReport);
    } catch (error) {
        createInternalServerResponse(res, error);
    }
}

module.exports = { createNewReport, getReportData, finishReport };