import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DataSource } from 'typeorm';
import { changeBadWords, getRegex } from '../utils/bad-word-regex/regexTask';
import { regexs } from "../utils/bad-word-regex/regexs.json";
import { makeLogTitle } from '../utils/user-logs-utils';
import { Post } from './entities/post.entity';
import { ReadPostsQueryDto } from './dto/read-posts-query.dto';
import { PostRepository } from './post.repository';
import { Log } from '../log/entity/log.entity';
import { ServerError } from '../common/exceptions/server-error.exception';
import { getPostHeadersDto } from './dto/get-post-headers.dto';
import { DeletePostDto } from './dto/delete-post.dto';


@Injectable()
export class PostService {
  constructor(private dataSource: DataSource,
              private postRepository: PostRepository,
  ) {}

  async createPost(createPostDto: CreatePostDto) : Promise<number> {

    const queryRunner = this.dataSource.createQueryRunner();
    let isTransactionStarted = false;

    try {

      let {doFilter, content, title, authorId} = createPostDto;

      if (doFilter) {
        const regex = getRegex(regexs);
        const newText = changeBadWords(content, regex);
        content = newText;
      };

      const newPost = Object.assign(new Post(),{title,content,author: authorId});
      const logTitle = makeLogTitle(title);
      const logValue = Object.assign(new Log(), {userId: authorId, title: logTitle, categoryId: 1});

    //트랜잭션
      await queryRunner.connect();
      await queryRunner.startTransaction();
      isTransactionStarted = true;

      const result = (await queryRunner.manager.save(newPost));
      const postId = result.id;
      await queryRunner.manager.getRepository(Log).save(logValue);

      await queryRunner.commitTransaction();
      
      return postId;
    } 
    catch (err) {
      if (isTransactionStarted) {
        await queryRunner.rollbackTransaction();
      }
      throw err;
    } 
    finally {
      await queryRunner.release();
    }
  }

  async findPostHeaders(readPostsQueryDto: ReadPostsQueryDto, userId: number) : Promise <getPostHeadersDto[]>{

    const postHeaders = await this.postRepository.getPostHeaders(readPostsQueryDto, userId);
  
    return postHeaders;
  }

  async findPostTotal(readPostsQueryDto: ReadPostsQueryDto, userId: number) : Promise<number> {

    const total = await this.postRepository.getPostTotal(readPostsQueryDto, userId);
    
    return total;
  
  }

  async findPost(postId: number, userId: number) : Promise<Post> {
    
    
    const post = await this.postRepository.getPostHeader(postId, userId);

    if(!post || Object.keys(post).length == 0){
      throw ServerError.notFound("존재하지 않는 게시글입니다.")
    } else {
      return post;
    }
  }

  async updatePost(postId: number, updatePostDto: UpdatePostDto) : Promise<boolean> {

    let {doFilter, content, title, authorId} = updatePostDto;
    
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!(post && !post.isDelete)) {
      throw ServerError.notFound("게시물 수정 실패: 존재하지 않는 게시물입니다.")
    }

    if (content && doFilter) {
			const regex = getRegex(regexs);
			content = changeBadWords(content, regex);
		}

    let result;
    if (content && title ) {
      result = await this.postRepository.update({id: postId, author: {id: authorId}}, {title, content,})
    } else if (title) {
      result = await this.postRepository.update({id: postId, author: {id: authorId}}, {title,})
    } else if (content) {
      result = await this.postRepository.update({id: postId, author: {id: authorId}}, {content,})
    };

    //TODO: 같은 내용 update해도 affected = 1 _express와 동일
    //WHERE문 추가로 affected=0으로 할 수는있음
    if (result && result.affected) {
      return true
    } else {
      throw ServerError.reference("게시글 수정 실패");
    };
  };

  async deletePost(deletePostDto: DeletePostDto) : Promise<boolean> {
    const {postId, authorId} = deletePostDto;
    const post = await this.postRepository.findOne({ where: { id: postId } });

    if (!(post && !post.isDelete)) {
      throw ServerError.notFound("게시글 삭제 실패: 존재하지 않는 게시물입니다.");
    }

    const result = await this.postRepository
      .update({id: postId, isDelete: 0, author: {id: authorId}}, {isDelete: 1});

      if(result.affected) {
        return true;
      } else {
        throw ServerError.reference("게시글 삭제 실패");
      };
  };
};
