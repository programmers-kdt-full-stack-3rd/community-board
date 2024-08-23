import { HttpMethod, httpRequest } from '../../../api/api';

export const fetchUserLogs = async (userId: number, currentPage: number, itemsPerPage: number) => {
    const URL = `admin/log/${userId}?index=${currentPage}&perPage=${itemsPerPage}`;
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
