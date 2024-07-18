import { useLayoutEffect, useState } from "react";
import { IPostHeader, mapDBToPostHeaders, SortBy } from "shared";
import { sendGetPostsRequest } from "../../api/posts/crud";
import PostModal from "../../component/Posts/Modal/PostModal";
import Pagination from "../../component/common/Pagination/Pagination";
import PostList from "../../component/Posts/PostList/PostList";
import SearchForm from "../../component/common/SearchForm/SearchForm";
import useMainPageSearchParams from "../../hook/useMainPageSearchParams";
import { useUserStore } from "../../state/store";
import {
  createPostButton,
  createPostButtonWrapper,
  mainPageStyle,
  postListActions,
} from "./Main.css";
import TestMain from "../../component/TestMain/TestMain";

const Main = () => {
  const isLogin = useUserStore((state) => state.isLogin);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [posts, setPosts] = useState<IPostHeader[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);

  const { searchParams, setSearchParams, parsed } = useMainPageSearchParams();

  useLayoutEffect(() => {
    const queryString = `?${searchParams.toString()}`;

    sendGetPostsRequest(queryString).then((data) => {
      if (data?.status >= 400) {
        // TODO: 에러 핸들링
        return;
      }

      const total = data?.total;

      if (typeof total !== "number") {
        // TODO: 에러 핸들링
        return;
      }

      const pageCount = Math.ceil(total / parsed.perPage);

      if (pageCount > 0 && parsed.index > pageCount) {
        const nextSearchParams = new URLSearchParams(searchParams);
        nextSearchParams.set("index", String(pageCount));
        setSearchParams(nextSearchParams);
      } else {
        setPosts(mapDBToPostHeaders(data.postHeaders));
        setTotalPosts(data?.total ?? 0);
      }
    });
  }, [parsed.index, parsed.perPage, parsed.keyword, parsed.sortBy]);

  const handlePostSort = (sortBy: SortBy | null) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.set("index", "1");

    if (sortBy === null) {
      nextSearchParams.delete("sortBy");
    } else {
      nextSearchParams.set("sortBy", String(sortBy));
    }

    setSearchParams(nextSearchParams);
  };

  const handlePageChange = async (page: number) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("index", String(page));

    setSearchParams(nextSearchParams);
  };

  const handleCreatePostClick = () => {
    setIsModalOpen(true);
  };

  const handleSearchSubmit = (keyword: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    nextSearchParams.set("index", "1");

    if (keyword) {
      nextSearchParams.set("keyword", keyword);
    } else {
      nextSearchParams.delete("keyword");
    }

    setSearchParams(nextSearchParams);
  };

  return (
    <div className={mainPageStyle}>
      {isModalOpen && <PostModal close={setIsModalOpen} />}

      {/* TODO: 최상단 헤더 연결 후 TestMain 제거 */}
      <TestMain />

      <PostList
        posts={posts}
        keyword={parsed.keyword}
        sortBy={parsed.sortBy}
        onSort={handlePostSort}
      />

      <Pagination
        currentPage={parsed.index}
        totalPosts={totalPosts}
        perPage={parsed.perPage}
        onChange={handlePageChange}
      />

      <div className={postListActions}>
        {isLogin && (
          <div className={createPostButtonWrapper}>
            <button
              className={createPostButton}
              onClick={handleCreatePostClick}
            >
              글쓰기
            </button>
          </div>
        )}

        <SearchForm
          defaultKeyword={parsed.keyword}
          onSubmit={handleSearchSubmit}
        />
      </div>
    </div>
  );
};

export default Main;
