import { SetStateAction, useState } from 'react'
import { CloseBtn, ContentTextArea, InputContainer, InputIndex, ModalBody, ModalContainer, ModalHeader, PostBtn, PostHeaderTitle, TitleInput } from './PostModal.css'

interface PostModalProps {
    close : React.Dispatch<SetStateAction<boolean>>;
}

const PostModal : React.FC<PostModalProps> = ({ close }) => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");


    return (
        <div className={ModalContainer}>
            <div className={ModalHeader}>
                <button className={PostBtn} onClick={()=>close(false)}>생성</button>
                <div className={PostHeaderTitle}>게시글 생성</div>
                <button className={CloseBtn} onClick={()=>close(false)}>취소</button>
            </div>
            <div className={ModalBody}>
                <div className={InputContainer}>
                    <div className={InputIndex}>제목</div>
                    <input className={TitleInput}
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                        placeholder='제목을 입력해주세요'></input>
                </div>
                <div className={InputContainer}>
                    <div className={InputIndex}>내용</div>
                    <textarea className={ContentTextArea}
                        value={content}
                        onChange={(e)=>setContent(e.target.value)}
                        placeholder='내용을 입력해주세요'></textarea>
                </div>
            </div> 
        </div>
    );
}

export default PostModal