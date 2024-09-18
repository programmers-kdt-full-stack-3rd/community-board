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
    
    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @Column()
    views: number

    @Column()
    isDelete: number

    @Column()
    is_private: number

    @ManyToOne(type=> User, user => user.posts)
    @JoinColumn({ name: 'author_id' }) 
    author: User

    @OneToMany(type => Like, like => like.post)
    likes: Like[]

}
