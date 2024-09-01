import { useEffect, useState } from 'react';
import { IUserInfoResponse } from 'shared';
import { HttpMethod, httpRequest } from '../../../api/api';
import { ClientError } from '../../../api/errors';
import { deleteButton, restoreButton, SearchUser, UserListDetail, UserListStyle, UserSearchInput } from './UserList.css';
import { AdminPostHeader } from '../PostMgmt/PostMgmt.css';
import { Link } from 'react-router-dom';
import { dateToStr } from '../../../utils/date-to-str';
import Pagination from '../../common/Pagination/Pagination';

const UserList = () => {
    const initialPage = 1;
    const itemsPerPage = 10;
    const [users, setUsers] = useState<IUserInfoResponse>({
        total: 0,
        userInfo: []
    });
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const nickname = "";
    const [email, setEmail] = useState<string>("");

    const fetchUsers = async () => {
        try {
            const url = `admin/user?index=${currentPage}&perPage=${itemsPerPage}${nickname ? `&nickname=${encodeURIComponent(nickname)}` : ''}${email ? `&email=${encodeURIComponent(email)}` : ''}`;
            const response = await httpRequest(url, HttpMethod.GET);
            if ((!response || response.total === 0) || (response.status == 400)) {
                setUsers({
                    total: 0,
                    userInfo: []
                });
            } else {
                setUsers(response);
            }

        } catch (err) {
            if (err instanceof ClientError) {
                console.error(`ClientError : ${err.code} : ${err.message}`);
            } else {
                console.error('error:', err);
            }

        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);

    const handleDelete = async (userId: number) => {
        try {
            const response = await httpRequest(`admin/user/${userId}`, HttpMethod.DELETE);
            if (response.status >= 400) {
                throw ClientError.autoFindErrorType(response.status, response.message || '사용자 삭제 실패');
            }

            setUsers(prevUsers => ({
                ...prevUsers,
                userInfo: prevUsers.userInfo.map(user =>
                    user.id === userId ? { ...user, isDelete: true } : user
                )
            }));

            alert('사용자가 성공적으로 삭제되었습니다.');
        } catch (err) {
            if (err instanceof ClientError) {
                console.error(`Error ${err.code}: ${err.message}`);
            } else {
                console.error('error:', err);
            }
            alert('사용자 삭제 실패');
        }
    };

    const handleRestore = async (userId: number) => {
        try {
            const response = await httpRequest(`admin/user/${userId}/restore`, HttpMethod.PATCH);
            if (response.status >= 400) {
                throw ClientError.autoFindErrorType(response.status, response.message || '사용자 복구 실패');
            }
            setUsers(prevUsers => ({
                ...prevUsers,
                userInfo: prevUsers.userInfo.map(user =>
                    user.id === userId ? { ...user, isDelete: false } : user
                )
            }));

            alert('사용자가 성공적으로 복구되었습니다.');
        } catch (err) {
            if (err instanceof ClientError) {
                console.error(`Error ${err.code}: ${err.message}`);
            } else {
                console.error('error:', err);
            }
            alert('사용자 복구 실패');
        }
    };


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchUsers();

    };

    return (
        <div>
            <div className={AdminPostHeader}>
                <h2>사용자 목록</h2>
                <div className={SearchUser}>
                    <input
                        className={UserSearchInput}
                        type="text"
                        placeholder="이메일을 입력해주세요"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button onClick={handleSearch}>검색</button>
                </div>
            </div>

            <hr></hr>
            <div className={UserListStyle}>
                <div>닉네임</div>
                <div>이메일</div>
                <div>가입일</div>
                <div>댓글 수</div>
                <div>게시글 수</div>
                <div>계정</div>
            </div>
            <hr></hr>

            <div>
                {users.total === 0 ? (
                    <p>사용자가 없습니다.</p>
                ) : (

                    users.userInfo.map(user => (
                        <div>

                            <div
                                key={user.id}
                                className={UserListDetail}
                            >
                                <Link to={`/admin/userLog/${user.id}`}>
                                    {user.nickname}
                                </Link>
                                <div>{user.email}</div>
                                <div>{dateToStr(new Date(user.createdAt), true)}</div>
                                <div>{user.statistics.comments}</div>
                                <div>{user.statistics.posts}</div>
                                <div>
                                    {user.isDelete ? (
                                        <button className={restoreButton}
                                            onClick={() => {
                                                if (window.confirm("해당 사용자를 복구하시겠습니까?")) {
                                                    handleRestore(user.id);
                                                }
                                            }}
                                        >
                                            복구
                                        </button>
                                    ) : (
                                        <button className={deleteButton}
                                            onClick={() => {
                                                if (window.confirm("해당 사용자를 삭제하시겠습니까?")) {
                                                    handleDelete(user.id);
                                                }
                                            }}
                                        >
                                            삭제
                                        </button>
                                    )}
                                </div>
                            </div>

                            <hr style={{ borderColor: 'rgba(0, 0, 0, 0.8)', borderWidth: '1px' }} />
                        </div>
                    ))
                )}
            </div>
            <hr></hr>


            <Pagination
                currentPage={currentPage}
                totalPosts={users.total}
                perPage={itemsPerPage}
                onChange={handlePageChange}
            />
        </div>
    );

};

export default UserList;
