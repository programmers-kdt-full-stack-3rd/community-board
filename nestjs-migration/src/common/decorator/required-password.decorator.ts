import { SetMetadata } from "@nestjs/common";

export const RequiredPassword = () => SetMetadata("requiredPassword", true);
