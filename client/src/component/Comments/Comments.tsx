import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { IComment, mapDBToComments } from "shared";
import {
  sendGetCommentsRequest,
  sendPostCommentRequest,
} from "../../api/comments/crud";
import Pagination from "../common/Pagination/Pagination";
import CommentForm from "./CommentForm/CommentForm";
import CommentItem from "./CommentItem/CommentItem";
import {
  commentCount,
  commentFormTitle,
  commentList,
  commentSection,
  commentSectionTitle,
  commentWriteSection,
  noComment,
} from "./Comments.css";

interface ICommentsProps {
  postId: number;
}

const Comments = ({ postId }: ICommentsProps) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [total, setTotal] = useState(0);

  const [searchParams, setSearchParams] = useSearchParams();
  const commentListRef = useRef<HTMLDivElement>(null);

  const fetchComments = useCallback(async () => {
    const requestSearchParams = new URLSearchParams(
      [
        ["post_id", String(postId)],
        ["index", searchParams.get("comment_index") ?? ""],
        ["perPage", searchParams.get("comment_perPage") ?? ""],
      ].filter(([_, value]) => value)
    );

    const queryString = `?${requestSearchParams.toString()}`;

    const data = await sendGetCommentsRequest(queryString);

    if (data.status >= 400) {
      // TODO: 에러 핸들링
      console.error(data);
      return;
    }

    setComments(mapDBToComments(data.comments));
    setTotal(data.total);
  }, [postId, searchParams]);

  useLayoutEffect(() => {
    if (postId < 1) {
      return;
    }

    fetchComments();
  }, [postId, searchParams]);

  const handleCommentCreate = async (content: string): Promise<boolean> => {
    try {
      const response = await sendPostCommentRequest({
        content,
        post_id: postId,
      });

      if (response?.status >= 400) {
        console.error(response);
        alert("댓글 작성에 실패했습니다.");
        return false;
      }

      fetchComments();
      alert("댓글을 작성했습니다.");
    } catch (error) {
      console.error(error);
      alert("댓글 작성에 실패했습니다.");
      return false;
    }

    return true;
  };

  const handleCommentUpdate = async () => {
    await fetchComments();
  };

  const handlePageChange = async (page: number) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("comment_index", String(page));

    setSearchParams(nextSearchParams);

    const commentListY =
      window.scrollY + (commentListRef.current?.getBoundingClientRect().y ?? 0);
    window.scrollTo({ top: commentListY - 40 });
  };

  return (
    <div className={commentSection}>
      <h2 className={commentSectionTitle}>
        댓글<span className={commentCount}> ({total}개)</span>
      </h2>

      <div className={commentWriteSection}>
        <h3 className={commentFormTitle}>새 댓글을 남겨 보세요.</h3>
        <CommentForm onSubmit={handleCommentCreate} />
      </div>

      <div className={commentList} ref={commentListRef}>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onUpdate={handleCommentUpdate}
            />
          ))
        ) : (
          <p className={noComment}>
            아직 댓글이 없습니다.
            <br />첫 댓글을 작성해 보세요.
          </p>
        )}
      </div>

      {total > 50 && (
        <Pagination
          currentPage={Number(searchParams.get("comment_index")) || 1}
          totalPosts={total}
          perPage={Number(searchParams.get("comment_perPage")) || 50}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default Comments;
