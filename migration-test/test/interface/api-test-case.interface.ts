type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export interface IApiTestCase {
	description: string;
	endpoint: string;
	method: HttpMethod;
	data?: Record<string, any>;
	ignoreFields?: string[];
	statusCode?: number;
}
