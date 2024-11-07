import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("post_categories")
export class PostCategories {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 50 })
	name: string;
}
