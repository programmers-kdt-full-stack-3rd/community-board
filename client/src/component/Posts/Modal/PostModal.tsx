import { SetStateAction, useState } from 'react'
import { CloseBtn, ContentTextArea, InputContainer, InputIndex, ModalBody, ModalContainer, ModalHeader, PostBtn, PostHeaderTitle, TitleInput } from './PostModal.css'
import { sendCreatePostRequest, sendUpdatePostRequest } from '../../../api/posts/crud';

interface IPostData {
    id : number;
    title : string;
    content : string;
}

interface IPostModalProps {
    close : React.Dispatch<SetStateAction<boolean>>;
    originalPostData? : IPostData
}

const PostModal : React.FC<IPostModalProps> = ({ close, originalPostData }) => {
    const isUpdateMode = originalPostData !== undefined;

    const modalMode = isUpdateMode ? "수정" : "생성";

    const [title, setTitle] = useState(isUpdateMode ? originalPostData.title : "");
    const [content, setContent] = useState(isUpdateMode ? originalPostData.content : "");

    const createPost = () => {
        const body = {
            title,
            content
        };

        sendCreatePostRequest(body).then((res)=>{
            console.log(res);
        })
    };

    const updatePost = () => {
        if (!originalPostData){
            return;
        }

        const body = {
            title,
            content
        };

        const postId : number = originalPostData.id;

        sendUpdatePostRequest(postId, body).then((res)=>{
            console.log(res);
        })
    };

    return (
        <div className={ModalContainer}>
            <div className={ModalHeader}>
                <button className={PostBtn}
                        onClick={()=>{
                            if(isUpdateMode){
                                updatePost();
                            } else {
                                createPost();
                            }
                            close(false);
                            window.location.reload();
                        }}>{modalMode}</button>
                <div className={PostHeaderTitle}>게시글 {modalMode}</div>
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