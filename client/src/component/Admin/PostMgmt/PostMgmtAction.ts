export const handleDeletePost = async (postId: number, refreshPosts: () => void) => {
    try {
        const response = await fetch(`/api/admin/post/${postId}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Failed to delete post');
        alert('게시글이 삭제되었습니다.');
        refreshPosts();
    } catch (err) {
        console.error('Delete error:', err);
        alert('게시글 삭제에 실패했습니다.');
    }
};

export const handleRestorePost = async (postId: number, refreshPosts: () => void) => {
    try {
        const response = await fetch(`/api/admin/post/${postId}/restore`, { method: 'PATCH' });
        if (!response.ok) throw new Error('Failed to restore post');
        alert('게시글이 복구되었습니다.');
        refreshPosts();
    } catch (err) {
        console.error('Restore error:', err);
        alert('게시글 복구에 실패했습니다.');
    }
};

export const handlePostPublic = async (postId: number, refreshPosts: () => void) => {
    try {
        const response = await fetch(`/api/admin/post/${postId}/public`, { method: 'PATCH' });
        if (!response.ok) throw new Error('Failed to make post public');
        alert('게시글이 공개되었습니다.');
        refreshPosts();
    } catch (err) {
        console.error('Public error:', err);
        alert('게시글 공개에 실패했습니다.');
    }
};

export const handlePostPrivate = async (postId: number, refreshPosts: () => void) => {
    try {
        const response = await fetch(`/api/admin/post/${postId}/private`, { method: 'PATCH' });
        if (!response.ok) throw new Error('Failed to make post private');
        alert('게시글이 비공개되었습니다.');
        refreshPosts();
    } catch (err) {
        console.error('Private error:', err);
        alert('게시글 비공개에 실패했습니다.');
    }
};