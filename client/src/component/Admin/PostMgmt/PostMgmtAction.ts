import { HttpMethod, httpRequest } from "../../../api/api";
import { ClientError } from "../../../api/errors";

export const handleDeletePost = async (postId: number, refreshPosts: () => void) => {
    try {
        const response = await httpRequest(`admin/post/${postId}`, HttpMethod.DELETE);
        if (response.status >= 400) throw new ClientError(response.status, '게시글 삭제 실패');
        alert('게시글이 삭제되었습니다.');
        refreshPosts();  // Refresh the posts list
    } catch (err) {
        if (err instanceof ClientError) {
            console.error('ClientError :', err.message);
        } else {
            console.error('error : ', err);
        }
        alert('게시글 삭제 실패');
    }
};

export const handleRestorePost = async (postId: number, refreshPosts: () => void) => {
    try {
        const response = await httpRequest(`admin/post/${postId}/restore`, HttpMethod.PATCH);
        if (response.status >= 400) throw new ClientError(response.status, '게시글 복구 실패');
        alert('게시글이 복구되었습니다.');
        refreshPosts();  // Refresh the posts list
    } catch (err) {
        if (err instanceof ClientError) {
            console.error('ClientError :', err.message);
        } else {
            console.error('error:', err);
        }
        alert('게시글 복구 실패');
    }
};

export const handlePostPublic = async (postId: number, refreshPosts: () => void) => {
    try {
        const response = await httpRequest(`admin/post/${postId}/public`, HttpMethod.PATCH);
        if (response.status >= 400) throw new ClientError(response.status, '게시글 상태 변경 실패');
        alert('게시글이 공개 상태로 변경되었습니다.');
        refreshPosts();  // Refresh the posts list
    } catch (err) {
        if (err instanceof ClientError) {
            console.error('ClientError :', err.message);
        } else {
            console.error('error :', err);
        }
        alert('게시글 상태 변경 실패');
    }
};

export const handlePostPrivate = async (postId: number, refreshPosts: () => void) => {
    try {
        const response = await httpRequest(`admin/post/${postId}/private`, HttpMethod.PATCH);
        if (response.status >= 400) throw new ClientError(response.status, '게시글 상태 변경 실패');
        alert('게시글이 비공개되었습니다.');
        refreshPosts();  // Refresh the posts list
    } catch (err) {
        if (err instanceof ClientError) {
            console.error('ClientError :', err.message);
        } else {
            console.error('error:', err);
        }
        alert('게시글 상태 변경 실패');
    }
};
