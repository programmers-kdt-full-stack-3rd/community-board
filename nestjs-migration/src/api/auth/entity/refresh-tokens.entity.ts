import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("refresh_tokens")
export class RefreshTokens {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: "user_id" })
	userId: number;

	@Column()
	token: string;

	@Column({ name: "expired_at" })
	expiredAt: Date;
}
