import { useEffect, useState } from 'react';
import { IUser } from 'shared';
import { dateToStr } from '../../../utils/date-to-str';
import Pagination from '../../common/Pagination/Pagination';
import { EmptyUserList } from './EmptyUserList';
import { deleteButton, PageBtn, restoreButton, SearchUser, UserListDetail, UserListPage, UserListStyle, UserSearchInput } from './UserList.css';

interface IUserListProps {
    initialPage?: number;
    itemsPerPage?: number;
}

const UserList = ({ initialPage = 1, itemsPerPage = 5 }: IUserListProps) => {
    const [users, setUsers] = useState<IUser[] | null>(null);
    const [totalUsers, setTotalUsers] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(initialPage);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [nickname, setNickname] = useState<string>("");
    const [email, setEmail] = useState<string>("");

    const fetchUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `/api/admin/user?index=${currentPage}&perPage=${itemsPerPage}${nickname ? `&nickname=${encodeURIComponent(nickname)}` : ''}${email ? `&email=${encodeURIComponent(email)}` : ''}`;
            //닉네임이나 이메일에 특수문자가 들어가는 경우 오류가 발생할 수 있기 때문에 encodeURIComponent 사용 추천
            const response = await fetch(url);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Fetch error: ${response.status} : ${response.statusText}`, errorText);
                throw new Error(`Error: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Data:', data);

            setUsers(data.userInfo);
            setTotalUsers(data.total);
        } catch (err) {
            console.error('Fetch error:', err);
            setError("사용자 불러오기 실패");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [currentPage, nickname, email]);

    //사용자 삭제 
    const handleDelete = async (userId: number) => {
        try {
            const response = await fetch(`/api/admin/user/${userId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`사용자 삭제 오류 : ${response.status} :  ${response.statusText}`, errorText);
                throw new Error(`Error : ${response.statusText}`);
            }

            setUsers(users => users?.map(user => user.id === userId ? { ...user, isDelete: true } : user) || null);
        } catch (err) {
            console.error('Error :', err);
            alert('사용자 삭제에 실패했습니다.');
        }
    };

    //사용자 복구
    const handleRestore = async (userId: number) => {
        try {
            const response = await fetch(`/api/admin/user/${userId}/restore`, {
                method: 'PATCH',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`사용자 복구 오류 : ${response.status} : ${response.statusText}`, errorText);
                throw new Error(`Error: ${response.statusText}`);
            }


            setUsers(users => users?.map(user => user.id === userId ? { ...user, isDelete: false } : user) || null);
        } catch (err) {
            console.error('Error :', err);
            alert('사용자 복구에 실패했습니다.');
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    //사용자 검색
    const handleSearch = () => {
        setCurrentPage(1);
        fetchUsers();
    };

    return (
        <div>
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
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : users === null || users.length === 0 ? (
                    <EmptyUserList
                        isFetchFailed={false}
                        keyword=""
                    />
                ) : (
                    users.map(user => (
                        <div
                            key={user.id}
                            className={UserListDetail}
                        >
                            <div>{user.nickname}</div>
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
                    ))
                )}
            </div>
            <hr></hr>

            <Pagination
                currentPage={currentPage}
                totalPosts={totalUsers}
                perPage={itemsPerPage}
                onChange={handlePageChange}
            />
        </div>
    );
};

export default UserList;