import UserLogItem from '../../component/Admin/UserLog/UserLogItem';
import Pagination from '../../component/common/Pagination/Pagination';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IUserLog } from 'shared';
import { fetchUserLogs, fetchUserStats } from '../../component/Admin/UserLog/UserLog';
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

const useFetchUserData = (userId: number, initialPage: number, itemsPerPage: number) => {
    const [logs, setLogs] = useState<IUserLog[]>([]);
    const [stats, setStats] = useState({ posts: 0, comments: 0, views: 0 });
    const [error, setError] = useState<string | null>(null);

    const fetchLogs = async () => {
        try {
            const data = await fetchUserLogs(userId, initialPage, itemsPerPage);
            setLogs(data.logs || []);
        } catch (err) {
            setError("로그를 가져오는 데 실패했습니다.");
        }
    };

    const fetchStats = async () => {
        try {
            const statsData = await fetchUserStats(userId);
            setStats({
                posts: statsData.stats.posts || 0,
                comments: statsData.stats.comments || 0,
                views: statsData.stats.views || 0,
            });
        } catch (err) {
            setError("통계 정보를 가져오는 데 실패했습니다.");
        }
    };

    useEffect(() => {
        if (!isNaN(userId)) {
            fetchLogs();
            fetchStats();
        }
    }, [userId, initialPage]);

    return { logs, stats, error };
};

export const AdminUserLogPage = () => {
    const { userId } = useParams<{ userId: string }>();
    const userIdNum = userId ? parseInt(userId, 10) : NaN;

    const initialPage = 1;
    const itemsPerPage = 10;

    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [onlyPost, setOnlyPost] = useState<boolean>(false);
    const [onlyComment, setOnlyComment] = useState<boolean>(false);

    const { logs, stats, error } = useFetchUserData(userIdNum, currentPage, itemsPerPage);

    const filteredLogs = logs.filter(log => {
        if (onlyPost) return log.category === '게시글';
        if (onlyComment) return log.category === '댓글';
        return true;
    });

    const paginatedFilteredLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const nickname = useUserStore.use.nickname();

    return (
        <div>
            <div className={Title} onClick={() => { setOnlyPost(false); setOnlyComment(false); setCurrentPage(initialPage); }}>
                <h1>{nickname}</h1>
                <p>님의 활동 내역</p>
            </div>
            <div className={LogContainer}>

                <div className={UserStats}>
                    <div onClick={() => { setOnlyPost(true); setOnlyComment(false); setCurrentPage(initialPage); }}>
                        <FaBookOpen className={StatsIcon} />
                        <div className={StatsCount}>게시글 수</div>
                        <h2>{stats.posts}</h2>
                    </div>
                    <div onClick={() => { setOnlyPost(false); setOnlyComment(true); setCurrentPage(initialPage); }}>
                        <IoChatbubbleEllipsesSharp className={StatsIcon} />
                        <div className={StatsCount}>댓글 수</div>
                        <h2>{stats.comments}</h2>
                    </div>
                    <div>
                        <HiCursorClick className={StatsIcon} />
                        <div className={StatsCount}>조회수</div>
                        <h2>{stats.views}</h2>
                    </div>
                </div>

                <div className={LogStyle}>
                    <hr />
                    <div className={LogListStyle}>
                        <div>제목</div>
                        <div>카테고리</div>
                        <div>작성일</div>
                    </div>
                    <hr />
                    <div>
                        {error ? (
                            <p>{error}</p>
                        ) : paginatedFilteredLogs.length > 0 ? (
                            paginatedFilteredLogs.map((log) => (
                                <div key={log.total}>
                                    <UserLogItem log={log} />
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
                        onChange={setCurrentPage}
                    />
                </div>
            </div>
        </div>
    );
};
