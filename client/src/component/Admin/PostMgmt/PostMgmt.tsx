import { useEffect, useState } from 'react';
import { IUserPost } from 'shared';
import { AdminPostHeader, AdminPostListStyle, SearchPost, SearchPostInput } from './PostMgmt.css';
import Pagination from '../../common/Pagination/Pagination';
import PostItem from './PostMgmtItem';
import { HttpMethod, httpRequest } from '../../../api/api';
import { ClientError } from '../../../api/errors';

const PostList = () => {
    const initialPage = 1;
    const itemsPerPage = 10;
    const [posts, setPosts] = useState<IUserPost[]>([]);
    const [totalPosts, setTotalPosts] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [keyword, setKeyword] = useState<string>("");

    const fetchPostsData = async (currentPage: number, itemsPerPage: number, keyword: string) => {
        const url = `admin/post?index=${currentPage}&perPage=${itemsPerPage}${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ''}`;
        try {
            const response = await httpRequest(url, HttpMethod.GET);
            return response;
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


    const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchPostsData(currentPage, itemsPerPage, keyword);
            setPosts(data.postHeaders || []);
            setTotalPosts(data.total || 0);
        } catch (err) {
            setError("게시글을 불러오는데 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [keyword]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchPosts();
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
                loading ? (
                    <p>로딩중...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : posts.length === 0 ? (
                    <p>빈 게시판입니다.</p>
                ) : (
                    posts.map(post => (
                        <div>
                            <PostItem
                                key={post.id}
                                post={post}
                                refreshPosts={fetchPosts}
                            />
                            <hr style={{ borderColor: 'rgba(0, 0, 0, 0.8)', borderWidth: '1px' }} />
                        </div>
                    ))
                )
            }
            <hr />

            <Pagination
                currentPage={currentPage}
                totalPosts={totalPosts}
                perPage={itemsPerPage}
                onChange={handlePageChange}
            />
        </div >
    );
};

export default PostList;