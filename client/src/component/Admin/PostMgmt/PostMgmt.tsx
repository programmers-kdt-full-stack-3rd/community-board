import { useEffect, useState } from 'react';
import { AdminPostHeader, AdminPostListDetail, AdminPostListStyle, AdminPostTiTle, Private, Public, SearchPost, SearchPostInput } from './PostMgmt.css';
import Pagination from '../../common/Pagination/Pagination';
import { ApiCall } from '../../../api/api';
import { ClientError } from '../../../api/errors';
import { IAdminPostResponse } from 'shared';
import { Link } from 'react-router-dom';
import { dateToStr } from '../../../utils/date-to-str';
import { deleteButton, restoreButton } from '../UserMgmt/UserList.css';
import { handleAdminPostPrivate, handleAdminPostPublic, handleDeleteAdminPost, handleRestoreAdminPost, sendGetAdminPostsRequest } from '../../../api/admin/post_crud';

const PostList = () => {
    const initialPage = 1;
    const itemsPerPage = 10;
    const [posts, setPosts] = useState<IAdminPostResponse>({
        total: 0,
        postHeaders: []
    });
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [keyword, setKeyword] = useState<string>("");

    const fetchPosts = () => {
        ApiCall(
            () => sendGetAdminPostsRequest(currentPage, itemsPerPage, keyword),
            () => {
                setPosts({
                    total: 0,
                    postHeaders: []
                });
            }
        ).then(res => {
            if (res instanceof ClientError) {
                return;
            }
            setPosts(res);
        });
    };


    useEffect(() => {
        fetchPosts()
    }, [currentPage]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchPosts();
    };

    const handlePostUpdate = async (updateFunction: () => Promise<void>) => {
        await updateFunction();
        fetchPosts()
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
                                                handlePostUpdate(() => handleAdminPostPublic(post.id));
                                            }
                                        }}
                                    >
                                        비공개
                                    </button>
                                ) : (
                                    <button className={Public}
                                        onClick={() => {
                                            if (window.confirm("해당 게시글을 비공개 상태로 변경하시겠습니까?")) {
                                                handlePostUpdate(() => handleAdminPostPrivate(post.id));
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
                                                handlePostUpdate(() => handleRestoreAdminPost(post.id));

                                            }
                                        }}>
                                        복구
                                    </button>
                                ) : (
                                    <button className={deleteButton}
                                        onClick={() => {
                                            if (window.confirm("해당 게시글을 삭제하시겠습니까?")) {
                                                handlePostUpdate(() => handleDeleteAdminPost(post.id));
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