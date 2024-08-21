import { IUserPost } from 'shared';
import { Link } from 'react-router-dom';
import { dateToStr } from '../../../utils/date-to-str';
import { AdminPostListDetail, AdminPostTiTle, Private, Public } from './PostMgmt.css';
import { deleteButton, restoreButton } from '../UserMgmt/UserList.css';
import { handleDeletePost, handlePostPrivate, handlePostPublic, handleRestorePost } from './PostMgmtAction';

interface IPostItemProps {
    post: IUserPost;
    refreshPosts: () => void;
}

const PostItem = ({ post, refreshPosts }: IPostItemProps) => {
    return (
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
    );
};

export default PostItem;