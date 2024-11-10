import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	Unique,
} from "typeorm";
import { User } from "../../user/entities/user.entity";
import { OAuthProvider } from "./oauth-provider.entity";

@Entity("oauth_connections")
@Unique(["oAuthProviderId", "oAuthAccountId"])
export class OAuthConnection {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ name: "user_id" })
	userId: number;

	@Column({ name: "oauth_provider_id" })
	oAuthProviderId: number;

	@Column({ length: 255, name: "oauth_account_id" })
	oAuthAccountId: string;

	@Column({ type: "text", name: "oauth_refresh_token", nullable: true })
	oAuthRefreshToken: string | null;

	@Column({ name: "is_delete", default: false })
	isDelete: boolean;

	@ManyToOne(() => User, user => user.id, { onDelete: "CASCADE" })
	@JoinColumn({ name: "user_id" })
	user: User;

	@ManyToOne(() => OAuthProvider, oauthProvider => oauthProvider.id, {
		onDelete: "CASCADE",
	})
	@JoinColumn({ name: "oauth_provider_id" })
	oAuthProvider: OAuthProvider;
}
