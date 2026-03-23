import { request } from "./api.js";

const API_BASE_URL = process.env.API_URL;
const REPORTS_URL = '/reports';

export const createNewReportRequest = async (messageId, reporterId) => {
    await request('post', API_BASE_URL + REPORTS_URL, { messageId, reporterId });
}

export const getReportDataRequest = async (messageId) => {
    return await request('get', `${API_BASE_URL}${REPORTS_URL}/${messageId}`);
}

export const patchReportRequest = async (messageId) => {
    return await request('patch', API_BASE_URL + REPORTS_URL, { messageId });
}