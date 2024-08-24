let apiURL: string | null = null;

const initURL = (url: string) => {
	if (apiURL === null) {
		apiURL = url;
	}
};

const httpRequest = async (path: string, method: string, body: object) => {
	if (apiURL === null) throw new Error("API URL이 초기화되지 않았습니다.");

	const response = await fetch(`${apiURL}/${path}`, {
		method,
		credentials: "include",
		headers: {
			"Content-Type": "application/json",
		},
		body: method === "GET" ? undefined : JSON.stringify(body), // body를 JSON 문자열로 변환
	});

	if (!response.ok) {
		throw new Error(`HTTP 응답 확인: ${response.status}`);
	}

	// JSON 아닐 경우 처리
	const contentType = response.headers.get("content-type");

	if (contentType && contentType.includes("application/json")) {
		// JSON 응답 처리
		return await response.json();
	} else {
		// JSON이 아닌 응답 처리
		const text = await response.text();
		console.error("Unexpected content type:", contentType);
		console.error("Response body:", text);
		throw new Error("JSON이 아닙니다.");
	}
};

export { initURL, httpRequest };
