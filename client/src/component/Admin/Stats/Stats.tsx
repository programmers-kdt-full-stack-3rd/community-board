import { TInterval } from "shared";
import { HttpMethod, httpRequest } from "../../../api/api";

export const fetchTotalStats = async (startDate: string, endDate: string, interval: TInterval) => {
    const URL = `admin/stat?startDate=${startDate}&endDate=${endDate}&interval=${interval}`;
    try {
        const response = await httpRequest(URL, HttpMethod.GET);
        if (response.status >= 400) {
            const errorText = response.message || 'API 응답 오류';
            throw new Error(errorText);
        }
        return response;
    } catch (err) {
        throw err;
    }
};
