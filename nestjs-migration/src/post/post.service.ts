import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DataSource } from 'typeorm';
import { changeBadWords, getRegex } from '../utils/bad-word-regex/regexTask';
import {regexs} from "../utils/bad-word-regex/regexs.json";
import { makeLogTitle } from '../utils/user-logs-utils';
import { Post } from './entities/post.entity';
import { UserRepository } from '../user/user.repository';
import { ReadPostsQueryDto } from './dto/read-posts-query.dto';
import { PostRepository } from './post.repository';
import { Log } from '../log/entity/log.entity';


@Injectable()
export class PostService {
  constructor(private dataSource: DataSource,
              private postRepository: PostRepository,
              private userRepository: UserRepository
  ) {}

  async createPost(createPostDto: CreatePostDto) {

    const queryRunner = this.dataSource.createQueryRunner();

    try {

      let {doFilter, content, title, author_id} = createPostDto;

      const author = await this.userRepository.findOne({where: {id:author_id}});

      if (doFilter) {
        const regex = getRegex(regexs);
        const newText = changeBadWords(content, regex);
        content = newText;
      }

      const newPost = new Post();
      newPost.title = title;
      newPost.content = content;
      newPost.author = author;

      const logTitle = makeLogTitle(title);
      const logValue = new Log();
      logValue.user_id = author_id;
      logValue.title = logTitle;
      logValue.category_id = 1;

    //트랜잭션
      await queryRunner.connect();
      await queryRunner.startTransaction();

      const postId = (await queryRunner.manager.save(newPost)).id;
      await queryRunner.manager.getRepository(Log).save(logValue);

      await queryRunner.commitTransaction();
      
      return postId;
    } 
    catch (err) {
      await queryRunner.rollbackTransaction();
    } 
    finally {
      await queryRunner.release();
    }
  }

  async findPostHeaders(readPostsQueryDto: ReadPostsQueryDto, userId: number) {

    const postHeaders = await this.postRepository.getPostHeaders(readPostsQueryDto, userId);
  
    return postHeaders;
  }

  async findPostTotal(readPostsQueryDto: ReadPostsQueryDto, userId: number){

    const total = await this.postRepository.getPostTotal(readPostsQueryDto, userId);
    
    return total;
    

  }

  async findPost(post_id, userId) {
    
    const post = await this.postRepository.getPostHeader(post_id, userId);

    return post;
  }

  async updatePost(post_id: number, updatePostDto: UpdatePostDto) {

    let {doFilter, content, title, author_id} = updatePostDto;

    const author = await this.userRepository.findOne({where: {id:author_id}});
    const post = await this.postRepository.findOne({ where: { id: post_id } });
    console.log(post)

    if (!(author && post)) {
      throw ReferenceError("게시글 수정 실패")
    }
    const newPost = new Post();

    if (content && doFilter) {
			const regex = getRegex(regexs);
			const newText = changeBadWords(content, regex);
			content = newText;
		}

    newPost.title = title;
    newPost.content = content;
    newPost.author = author;

    if (content && title ) {
      return await this.postRepository.update({id: post_id}, {title: newPost.title, content: newPost.content})
    } else if (title) {
      return await this.postRepository.update({id: post_id}, {title: newPost.title})
    } else if (content) {
      return await this.postRepository.update({id: post_id}, {content: newPost.content})
    }
  }

  async deletePost(user_id, post_id: number) {
    const post = await this.postRepository.findOne({ where: { id: post_id } });
    const exist = !post.isDelete;

    if (!(post && exist)) {
      throw ReferenceError("게시글 삭제 실패")
    }
    const result = this.postRepository
      .update({id: post_id, isDelete: 0, author: user_id}, {isDelete: 1});

    return result;
  }
}
