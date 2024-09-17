import { Test, TestingModule } from "@nestjs/testing";
import { ServerError } from "../common/exceptions/server-error.exception";
import { RBAC_ERROR_MESSAGES } from "./constants/rbac.constants";
import { RbacService } from "./rbac.service";
import { RoleRepository } from "./repositories/roles.repository";

describe("RbacService", () => {
	let service: RbacService;
	let roleRepository: RoleRepository;

	const mockRoleRepository = {
		getPermissionsByRoleId: jest.fn(),
		findOne: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RbacService,
				{
					provide: RoleRepository,
					useValue: mockRoleRepository,
				},
			],
		}).compile();

		service = module.get<RbacService>(RbacService);
		roleRepository = module.get<RoleRepository>(RoleRepository);
	});

	describe("getPermissionsByRoleId", () => {
		it("퍼미션을 성공적으로 반환한다.", async () => {
			const roleId = 1;
			const permissions = ["permission1", "permission2"];
			mockRoleRepository.getPermissionsByRoleId.mockResolvedValue(
				permissions
			);

			const result = await service.getPermissionsByRoleId(roleId);

			expect(result).toEqual(permissions);
		});

		it("퍼미션이 없을 경우 에러를 반환한다.", async () => {
			const roleId = 1;
			mockRoleRepository.getPermissionsByRoleId.mockResolvedValue([]);

			await expect(
				service.getPermissionsByRoleId(roleId)
			).rejects.toThrow(ServerError);

			await expect(
				service.getPermissionsByRoleId(roleId)
			).rejects.toThrow(RBAC_ERROR_MESSAGES.NOT_FOUND_ROLE_PERMISSION);
		});
	});

	describe("isAdmin", () => {
		it("관리자 여부를 성공적으로 반환한다.", async () => {
			const roleId = 1;
			const role = { name: "admin" };
			mockRoleRepository.findOne.mockResolvedValue(role);

			const result = await service.isAdmin(roleId);

			expect(result).toBe(true);
		});

		it("해당 역할이 없을 경우 에러를 반환한다.", async () => {
			const roleId = 1;
			mockRoleRepository.findOne.mockResolvedValue(null);

			await expect(service.isAdmin(roleId)).rejects.toThrow(ServerError);
			await expect(service.isAdmin(roleId)).rejects.toThrow(
				RBAC_ERROR_MESSAGES.NOT_FOUND_ROLE
			);
		});

		it("관리자가 아닐 경우 false를 반환한다.", async () => {
			const roleId = 2;
			const role = { name: "user" };
			mockRoleRepository.findOne.mockResolvedValue(role);

			const result = await service.isAdmin(roleId);

			expect(result).toBe(false);
		});
	});
});
