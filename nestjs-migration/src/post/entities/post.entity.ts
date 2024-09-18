import { Comment } from "src/comment/entities/comment.entity"
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
    
    @CreateDateColumn({ name: "created_at", default: false })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_at", default: false })
    updatedAt: Date

    @Column()
    views: number

    @Column({ name: "is_delete" })
    isDelete: number

    @Column({ name: "is_private"})
    isPrivate: number

    @ManyToOne(type=> User, user => user.posts)
    @JoinColumn({ name: 'author_id' }) 
    author: User;

    @OneToMany(type => Like, like => like.post)
    likes: Like[]

    @OneToMany(type => Comment, comment => comment.post)
    comments: Comment[]

}
