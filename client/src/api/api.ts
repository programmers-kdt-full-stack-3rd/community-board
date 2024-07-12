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
    const requestAddress = `${import.meta.env.VITE_SERVER_ADDRESS}/api/${address}`;

    const response = await fetch(requestAddress, {
        method: method,
        credentials: 'include',
        headers: {
        'Content-Type': 'application/json',
        },
        body
    });

    let responseJson ;

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
        responseJson = await response.json();
    } else {
        const textResponse = await response.text();
        
        if (textResponse) {
            responseJson = JSON.parse(textResponse);
        }
    }

    return {
        ...responseJson,
        status : response.status
    }
}; 