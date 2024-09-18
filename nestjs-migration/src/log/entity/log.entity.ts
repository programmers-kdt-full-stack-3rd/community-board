import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_logs")
export class Log {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ name: "user_id"})
    userId: number

    @Column()
    title: string

    @Column({ name: "category_id"})
    categoryId: number

    @CreateDateColumn({ name: "created_at"})
    createdAt: Date
}