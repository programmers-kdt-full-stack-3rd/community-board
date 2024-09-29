import React, { useState } from "react";
import TextInput from "../../component/common/TextInput";
import { useLocation } from "react-router-dom";
import { InputContainer, InputIndex } from "../../component/Posts/Modal/PostModal.css";

const UpsertPostPage: React.FC = () => {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const postId = queryParams.get('postId');
	const title = queryParams.get('title') || "";
	const content = queryParams.get('content') || "";

	const [postTitle, setPostTitle] = useState<string>(title);
	const [postContent, setPostContent] = useState<string>(content);



	// Upsert : update + insert
	const handleUpsertPost = () => {
		if (postId) {
			// TODO : 게시글 수정 API
            setPostTitle("");
            console.log(postTitle);
		} else {
			// TODO : 게시글 생성 API
            setPostContent("");
            console.log(postContent);
		}
	};

    // const handleUploadImage = () => {
    //     if (content) {
    //         // 
    //     } else {
            
    //     }
    // };

	return (
		<div style={{
			display : 'flex',
			flexDirection : 'column',
			justifyContent : 'center',
			alignItems: 'center',
            width : '100%',
			paddingLeft : '50px',
			paddingRight : '50px',
			paddingTop : '10px',
            paddingBottom : '10px',
		}}>
			<div style={{
				display : 'flex',
				flexDirection : 'column',
				justifyContent : 'center',
				alignItems: 'center',
				width : '100%',
				paddingLeft : '50px',
				paddingRight : '50px',
				paddingTop : '10px',
				paddingBottom : '10px',
				border : '1px solid #ccc',
				gap : '20px'
			}}>
				<div className={InputContainer}>
					<div className={InputIndex}>
						제목
					</div>
					<TextInput
						placeholder="제목을 입력해주세요"
						value={postTitle}
						onChange={e => setPostTitle(e.target.value)}
					/>
				</div>
				<div className={InputContainer}>
					<div className={InputIndex}>
						내용
					</div>
					<div className="내용" onClick={handleUpsertPost}></div>
				</div>
			</div>
		</div>
	);
};

export default UpsertPostPage;
