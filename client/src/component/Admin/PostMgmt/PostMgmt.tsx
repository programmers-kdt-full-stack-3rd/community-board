import { useEffect, useState } from 'react';
import { AdminPostHeader, AdminPostListDetail, AdminPostListStyle, AdminPostTiTle, Private, Public, SearchPost, SearchPostInput } from './PostMgmt.css';
import Pagination from '../../common/Pagination/Pagination';
import { HttpMethod, httpRequest } from '../../../api/api';
import { ClientError } from '../../../api/errors';
import { IAdminPostResponse } from 'shared';
import { Link } from 'react-router-dom';
import { dateToStr } from '../../../utils/date-to-str';
import { handleDeletePost, handlePostPrivate, handlePostPublic, handleRestorePost } from './PostMgmtAction';
import { deleteButton, restoreButton } from '../UserMgmt/UserList.css';

const PostList = () => {
    const initialPage = 1;
    const itemsPerPage = 10;
    const [posts, setPosts] = useState<IAdminPostResponse>({
        total: 0,
        postHeaders: []
    });
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [keyword, setKeyword] = useState<string>("");

    const fetchPostsData = async (currentPage: number, itemsPerPage: number, keyword: string) => {
        const url = `admin/post?index=${currentPage}&perPage=${itemsPerPage}${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ''}`;
        try {
            const response = await httpRequest(url, HttpMethod.GET);
            setPosts(response);
            console.log(response);

        } catch (err) {
            if (err instanceof ClientError) {
                console.error(`ClientError : ${err.code} : ${err.message}`, err);
                throw new Error(`Error: ${err.message}`);
            } else {
                console.error("Error : ", err);
                throw new Error("Error");
            }
        }
    };


    useEffect(() => {
        fetchPostsData(currentPage, itemsPerPage, keyword);
    }, [currentPage, keyword, posts]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchPostsData(currentPage, itemsPerPage, keyword);
    };

    const refreshPosts = () => {
        fetchPostsData(currentPage, itemsPerPage, keyword);
    };

    return (
        <div>
            <div className={AdminPostHeader}>
                <h2>게시글 목록</h2>
                <div className={SearchPost}>
                    <input
                        className={SearchPostInput}
                        type="text"
                        placeholder="제목을 입력해주세요"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <button onClick={handleSearch}>검색</button>
                </div>
            </div>
            <hr />
            <div className={AdminPostListStyle}>
                <div>제목</div>
                <div>작성자</div>
                <div>작성일</div>
                <div>상태</div>
                <div>게시글</div>
            </div>
            <hr />
            {
                posts.total === 0 ? (
                    <p>빈 게시판입니다.</p>
                ) : (
                    posts.postHeaders.map(post => (
                        <div key={post.id} className={AdminPostListDetail}>
                            <Link to={`/post/${post.id}`} className={AdminPostTiTle}>
                                {post.title}
                            </Link>
                            <div>{post.author}</div>
                            <div>{dateToStr(new Date(post.createdAt), true)}</div>
                            <div>
                                {post.isPrivate ? (
                                    <button className={Private}
                                        onClick={() => {
                                            if (window.confirm("해당 게시글을 공개 상태로 변경하시겠습니까?")) {
                                                handlePostPublic(post.id, refreshPosts);
                                            }
                                        }}
                                    >
                                        비공개
                                    </button>
                                ) : (
                                    <button className={Public}
                                        onClick={() => {
                                            if (window.confirm("해당 게시글을 비공개 상태로 변경하시겠습니까?")) {
                                                handlePostPrivate(post.id, refreshPosts);
                                            }
                                        }}
                                    >
                                        공개
                                    </button>
                                )}
                            </div>
                            <div>
                                {post.isDelete ? (
                                    <button className={restoreButton}
                                        onClick={() => {
                                            if (window.confirm("해당 게시글을 복구하시겠습니까?")) {
                                                handleRestorePost(post.id, refreshPosts);
                                            }
                                        }}>
                                        복구
                                    </button>
                                ) : (
                                    <button className={deleteButton}
                                        onClick={() => {
                                            if (window.confirm("해당 게시글을 삭제하시겠습니까?")) {
                                                handleDeletePost(post.id, refreshPosts);
                                            }
                                        }}>
                                        삭제
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )
            }
            <hr />

            <Pagination
                currentPage={currentPage}
                totalPosts={posts.total}
                perPage={itemsPerPage}
                onChange={handlePageChange}
            />
        </div >
    );
};

export default PostList;