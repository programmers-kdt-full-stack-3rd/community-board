import { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { useUserStore } from "../../../state/store";
import {
  commentFormContainer,
  footer,
  submitButton,
  textArea,
} from "./CommentForm.css";

interface ICommentFormProps {
  defaultContent?: string;
  onSubmit: (content: string) => Promise<boolean>;
}

const CommentForm = ({
  defaultContent,
  onSubmit,
}: ICommentFormProps) => {
  const isLogin = useUserStore((state) => state.isLogin);

  const [content, setContent] = useState(defaultContent || "");

  const handleFormSubmit = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      const trimmedContent = content.trim();
      if (!trimmedContent) {
        alert("댓글 내용을 입력하세요.");
        return;
      }

      const success = await onSubmit(trimmedContent);
      if (success) {
        setContent("");
      }
    },
    [content, onSubmit]
  );

  const handleContentChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(event.target.value);
    },
    []
  );

  return (
    <form className={commentFormContainer} onSubmit={handleFormSubmit}>
      <textarea
        className={textArea}
        value={isLogin ? content : "댓글을 작성하려면 로그인이 필요합니다."}
        disabled={!isLogin}
        onChange={handleContentChange}
      />

      <div className={footer}>
        <button type="submit" className={submitButton} disabled={!isLogin}>
          등록
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
