export interface EmptyRequest {}

export interface Response {
	status: number;
	error: string;
}

export interface SuccessResponse extends Response {
	success: boolean;
}
