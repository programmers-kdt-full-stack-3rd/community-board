import { SetMetadata } from "@nestjs/common";

export const AdminOnly = () => SetMetadata("adminOnly", true);

export const Permissions = (...permissions: string[]) =>
	SetMetadata("permissions", permissions);
