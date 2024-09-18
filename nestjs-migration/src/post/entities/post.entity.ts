import { Like } from "../../like/entities/like.entity"
import { User } from "../../user/entities/user.entity"
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity("posts")
export class Post {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column()
    content: string
    
    @CreateDateColumn({ name: "created_at"})
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at"})
    updatedAt: Date

    @Column({default: 0})
    views: number

    @Column({ name: "is_delete" ,default: 0})
    isDelete: number

    @Column({ name: "is_private", default: 0})
    isPrivate: number

    @ManyToOne(type=> User, user => user.posts)
    @JoinColumn({ name: 'author_id' }) 
    author: User

    @OneToMany(type => Like, like => like.post)
    likes: Like[]

}
