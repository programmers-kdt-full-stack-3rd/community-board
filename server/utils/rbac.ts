import {
	addPermission,
	getPermission,
} from "../db/context/permissions_context";
import { addRole, getRole } from "../db/context/roles_context";
import {
	addPermissionToRole,
	getRolePermission,
} from "../db/context/roles_permission_context";
import { getUserPermission, getUserRole } from "../db/context/users_context";

// RBAC (Role-Based Access Control)

/**
 *
 * @param roleId 역할 ID
 * @returns 역할 이름
 *
 * 역할 ID를 받아서 해당 역할의 이름을 반환합니다.
 */
export const getRoleName = async (roleId: number) => {
	const role = await getRole(roleId);
	return role.name;
};

/**
 *
 * @param permissionId 권한 ID
 * @returns 권한 이름
 *
 * 권한 ID를 받아서 해당 권한의 이름을 반환합니다.
 */

export const getPremissionName = async (permissionId: number) => {
	const permission = await getPermission(permissionId);
	return permission.name;
};

/**
 *
 * @param userId 사용자 ID
 * @returns 사용자의 역할 ID와 역할 이름
 *
 * 사용자 ID를 받아서 해당 사용자의 역할 ID와 역할 이름을 반환합니다.
 */
export const getRolebyUserId = async (userId: number) => {
	const { role_id, role_name } = await getUserRole(userId);

	return { role_id, role_name };
};

/**
 *
 * @param userId 사용자 ID
 * @returns 사용자의 권한 ID들과 권한 이름들
 *
 * 사용자 ID를 받아서 해당 사용자의 권한 ID와 권한 이름을 반환합니다.
 */
export const getPermissionbyUserId = async (userId: number) => {
	const result = await getUserPermission(userId);
	const permissionIds = result.map(permission => permission.permission_id);
	const permissionNames = result.map(
		permission => permission.permission_name
	);

	return { permissionIds, permissionNames };
};

/**
 *
 * @param roleId 역할 ID
 * @returns 역할의 권한 ID들과 권한 이름들
 *
 * 역할 ID를 받아서 해당 역할의 권한 ID와 권한 이름을 반환합니다.
 */
export const getPermissionbyRoleId = async (roleId: number) => {
	const result = await getRolePermission(roleId);
	const permissionIds = result.map(permission => permission.permission_id);
	const permissionNames = result.map(
		permission => permission.permission_name
	);

	return { permissionIds, permissionNames };
};

/**
 *
 * @param name 역할 이름
 *
 * 역할 이름을 받아서 역할을 생성합니다.
 */
export const createRole = async (name: string) => {
	await addRole(name);
};

/**
 *
 * @param name 권한 이름
 *
 * 권한 이름을 받아서 권한을 생성합니다.
 */
export const createPermission = async (name: string) => {
	await addPermission(name);
};

/**
 *
 * @param roleId 역할 ID
 * @param permissionId 권한 ID
 *
 * 역할 ID와 권한 ID를 받아서 해당 역할에 권한을 추가합니다.
 */
export const mapPermissionToRole = async (
	roleId: number,
	permissionId: number
) => {
	const role = await getRole(roleId);
	const permission = await getPermission(permissionId);

	if (!role || !permission) {
		throw new Error("Role 또는 Permission을 찾을 수 없습니다.");
	}

	addPermissionToRole(roleId, permissionId);

	console.log(
		`Role: ${role.name}에 Permission: ${permission.name}이 추가되었습니다.`
	);
};
