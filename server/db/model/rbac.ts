import { RowDataPacket } from "mysql2/promise";

export interface IRole {
	role_id: number;
	role_name: string;
}

export interface IPermission {
	permission_id: number;
	permission_name: string;
}

export interface IRoleRow extends IRole, RowDataPacket {}
export interface IPermissionRow extends IPermission, RowDataPacket {}
