import { useEffect, useState } from 'react';
import { IUserInfoResponse } from 'shared';
import { ApiCall } from '../../../api/api';
import { ClientError } from '../../../api/errors';
import { deleteButton, restoreButton, SearchUser, UserListDetail, UserListStyle, UserSearchInput } from './UserList.css';
import { AdminPostHeader } from '../PostMgmt/PostMgmt.css';
import { Link } from 'react-router-dom';
import { dateToStr } from '../../../utils/date-to-str';
import Pagination from '../../common/Pagination/Pagination';
import { handleDeleteAdminUser, handleRestoreAdminUser, sendGetAdminUsersRequest } from '../../../api/admin/user_crud';

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

    const fetchUsers = () => {
        ApiCall(
            () => sendGetAdminUsersRequest(currentPage, itemsPerPage, nickname, email),
            () => {
                setUsers({
                    total: 0,
                    userInfo: []
                });
            }
        ).then(res => {
            if (res instanceof ClientError) {
                return;
            }
            setUsers(res);
        });
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage]);



    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchUsers();

    };
    const handleUserUpdate = async (updateFunction: () => Promise<void>) => {
        await updateFunction();
        fetchUsers()
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
                                                    handleUserUpdate(() => handleRestoreAdminUser(user.id));

                                                }
                                            }}
                                        >
                                            복구
                                        </button>
                                    ) : (
                                        <button className={deleteButton}
                                            onClick={() => {
                                                if (window.confirm("해당 사용자를 삭제하시겠습니까?")) {
                                                    handleUserUpdate(() => handleDeleteAdminUser(user.id));
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
