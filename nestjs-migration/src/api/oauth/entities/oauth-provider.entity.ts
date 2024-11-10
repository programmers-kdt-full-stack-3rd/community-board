import { TOAuthProvider } from "shared";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("oauth_providers")
export class OAuthProvider {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 50, unique: true, nullable: false })
	name: TOAuthProvider;
}
