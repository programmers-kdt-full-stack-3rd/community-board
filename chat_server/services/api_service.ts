let apiURL: string | null = null;

const initURL = (url: string) => {
	if (apiURL === null) {
		apiURL = url;
	}
};

const httpRequest = async (path: string, { method, body }: RequestInit) => {
	try {
		if (apiURL === null) throw new Error("URL이 없습니다.");

		const response = await fetch(`${apiURL}/${path}`, {
			method,
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body,
		});

		if (!response.ok) {
			throw new Error(`status: ${response.status}`);
		}

		return await response.json();
	} catch (error) {
		throw error;
	}
};

export { initURL, httpRequest };
