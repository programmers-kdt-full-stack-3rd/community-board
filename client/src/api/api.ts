export enum HttpMethod {
    POST = 'POST',
    GET = 'GET',
    PUT = 'PUT',
    PATCH = 'PATCH',
    DELETE = 'DELETE'
}

export const convertToBody = (body : object) => {
    return JSON.stringify(body);
}

export const httpRequest = async (
    address : string,
    method : HttpMethod,
    body? : string
) => {
    const requestAddress = `http://localhost:9000/api/${address}`;

    const response = await fetch(requestAddress, {
        method: method,
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
        },
        body
    });

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        const responseJson = await response.json();
        return {
            ...responseJson,
            status: response.status
        };
    } else {
        // JSON 형식이 아닌 경우 수동으로 파싱
        const textResponse = await response.text();
        
        const parsedJson = JSON.parse(textResponse);
        return {
            ...parsedJson,
            status: response.status
        };
    }
}; 