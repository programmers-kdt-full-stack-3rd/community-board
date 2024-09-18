import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("user_logs")
export class Log {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    user_id: number

    @Column()
    title: string

    @Column()
    category_id: number

    @CreateDateColumn()
    created_at: Date
}