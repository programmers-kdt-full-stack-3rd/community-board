import UserLogItem from '../../component/Admin/UserLog/UserLogItem';
import Pagination from '../../component/common/Pagination/Pagination';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IUserLog } from 'shared';
import { fetchUserLogs } from '../../component/Admin/UserLog/UserLog';
import {
    LogContainer,
    LogListStyle,
    StatsCount,
    StatsIcon,
    UserStats,
    PaginationContainer,
    LogStyle,
    Title
} from '../../component/Admin/UserLog/UserLog.css';
import { useUserStore } from '../../state/store';
import { FaBookOpen } from "react-icons/fa";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { HiCursorClick } from "react-icons/hi";

export const AdminUserLogPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const userIdNum = userId ? parseInt(userId, 10) : NaN;

    const initialPage = 1;
    const itemsPerPage = 10;

    const [logs, setLogs] = useState<IUserLog[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [totalPostCount, setTotalPostCount] = useState<number>(0);
    const [totalCommentCount, setTotalCommentCount] = useState<number>(0);
    const [onlyPost, setOnlyPost] = useState<boolean>(false);
    const [onlyComment, setOnlyComment] = useState<boolean>(false);

    const nickname = useUserStore.use.nickname();

    const fetchLogs = async () => {
        try {
            const data = await fetchUserLogs(userIdNum, initialPage, 100);
            const allLogs = data.logs || [];
            setLogs(allLogs);

            const posts = allLogs.filter((log: { category: string; }) => log.category === '게시글').length;
            const comments = allLogs.filter((log: { category: string; }) => log.category === '댓글').length;
            setTotalPostCount(posts);
            setTotalCommentCount(comments);
        } catch (err) {
            console.error("fetch 실패", err);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handlePostClick = () => {
        setOnlyPost(true);
        setOnlyComment(false);
        setCurrentPage(initialPage);
    };

    const handleCommentClick = () => {
        setOnlyPost(false);
        setOnlyComment(true);
        setCurrentPage(initialPage);
    };

    const handleResetClick = () => {
        setOnlyPost(false);
        setOnlyComment(false);
        setCurrentPage(initialPage);
    };

    useEffect(() => {
        if (!isNaN(userIdNum)) {
            fetchLogs();
        }
    }, [userIdNum]);

    // 전체 / 게시글 / 댓글 필터링한 로그
    const filteredLogs = logs.filter((log) => {
        if (onlyPost) return log.category === '게시글';
        if (onlyComment) return log.category === '댓글';
        return true;
    });

    const paginatedFilteredLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            <div className={Title} onClick={handleResetClick}>
                <h1>{nickname}</h1>
                <p>님의 활동 내역</p>
            </div>
            <div className={LogContainer}>

                <div className={UserStats}>
                    <div onClick={handlePostClick}>
                        <FaBookOpen className={StatsIcon} />
                        <div className={StatsCount}>게시글 수</div>
                        <h2>{totalPostCount}</h2>
                    </div>
                    <div onClick={handleCommentClick}>
                        <IoChatbubbleEllipsesSharp className={StatsIcon} />
                        <div className={StatsCount}>댓글 수</div>
                        <h2>{totalCommentCount}</h2>
                    </div>
                    <div>
                        <HiCursorClick className={StatsIcon} />
                        <div className={StatsCount}>조회수</div>
                        <h2>124</h2>
                        {/* 임시 조회수 */}
                    </div>
                </div>

                <div className={LogStyle}>
                    <hr></hr>
                    <div className={LogListStyle}>
                        <div>제목</div>
                        <div>카테고리</div>
                        <div>작성일</div>
                    </div>
                    <hr />

                    <div>
                        {paginatedFilteredLogs.length > 0 ? (
                            paginatedFilteredLogs.map((log, index) => (
                                <div>
                                    <UserLogItem key={index} log={log} />
                                    <hr style={{ borderColor: 'rgba(0, 0, 0, 0.8)', borderWidth: '1px' }} />
                                </div>
                            ))
                        ) : (
                            <p>사용자의 활동 내역이 없습니다.</p>
                        )}
                    </div>
                    <hr />
                </div>

                <div className={PaginationContainer}>
                    <Pagination
                        currentPage={currentPage}
                        totalPosts={filteredLogs.length}
                        perPage={itemsPerPage}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};
