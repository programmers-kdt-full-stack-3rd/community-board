export interface EmptyRequest {}

export interface Response {
	error: string;
}

export interface SuccessResponse extends Response {
	success: boolean;
}
