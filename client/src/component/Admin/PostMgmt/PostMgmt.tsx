import { useEffect, useState } from 'react';
import { IUserPost } from 'shared';
import { AdminPostListStyle, AdminPostListDetail, AdminPostTiTle, SearchPost, SearchPostInput } from './PostMgmt.css';
import Pagination from '../../common/Pagination/Pagination';
import PostItem from './PostMgmtItem';

interface IPostListProps {
    initialPage?: number;
    itemsPerPage?: number;
}


const PostList = ({ initialPage = 1, itemsPerPage = 5 }: IPostListProps) => {
    const [posts, setPosts] = useState<IUserPost[]>([]);
    const [totalPosts, setTotalPosts] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [keyword, setKeyword] = useState<string>("");

    const fetchPostsData = async (currentPage: number, itemsPerPage: number, keyword: string) => {
        const url = `/api/admin/post?index=${currentPage}&perPage=${itemsPerPage}${keyword ? `&keyword=${encodeURIComponent(keyword)}` : ''}`;
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Fetch error: ${response.status} : ${response.statusText}`, errorText);
            throw new Error(`Error: ${response.statusText}`);
        }
        return await response.json();
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
    }, [currentPage, keyword]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchPosts();
    };

    return (
        <div>
            <div className={SearchPost}>
                <input className={SearchPostInput}
                    type="text"
                    placeholder="제목을 입력해주세요"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                />
                <button onClick={handleSearch}>검색</button>
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
            {loading ? (
                <p>로딩중...</p>
            ) : error ? (
                <p>{error}</p>
            ) : posts.length === 0 ? (
                <p>빈 게시판입니다.</p>
            ) : (
                posts.map(post => (
                    <PostItem
                        key={post.id}
                        post={post}
                        refreshPosts={fetchPosts}
                    />
                ))
            )}
            <hr />
            <Pagination
                currentPage={currentPage}
                totalPosts={totalPosts}
                perPage={itemsPerPage}
                onChange={handlePageChange}
            />
        </div>
    );
};

export default PostList;