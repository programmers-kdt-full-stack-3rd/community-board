import clsx from "clsx";
import { MouseEvent } from "react";
import { FiArrowDown } from "react-icons/fi";
import { Link } from "react-router-dom";
import { IPostHeader, SortBy } from "shared";
import { dateToStr } from "../../../utils/date-to-str";
import {
  noPost,
  notSorted,
  postListBody,
  postListHeaderRow,
  postListLinks,
  postListRow,
  postListStyle,
  sortableIcon,
  sortableLink,
} from "./PostList.css";

interface IPostListProps {
  posts: IPostHeader[];
  keyword?: string;
  sortBy: SortBy | null;
  onSort: (sortBy: SortBy | null) => void;
}

const PostList = ({ posts, keyword, sortBy, onSort }: IPostListProps) => {
  const handleSortableClickWith =
    (nextSortBy: SortBy | null) => (event: MouseEvent) => {
      event.preventDefault();

      onSort(nextSortBy);
    };

  return (
    <div className={postListStyle}>
      <div className={clsx(postListHeaderRow, postListRow.container)}>
        <div className={postListRow.title}>제목</div>
        <div className={postListRow.author}>작성자</div>
        <div className={postListRow.created_at}>
          <a
            className={clsx(sortableLink, postListLinks)}
            href="#"
            onClick={handleSortableClickWith(null)}
          >
            작성일시
            <span
              className={clsx(sortableIcon, { [notSorted]: sortBy !== null })}
            >
              <FiArrowDown />
            </span>
          </a>
        </div>
        <div className={postListRow.likes}>
          <a
            className={clsx(sortableLink, postListLinks)}
            href="#"
            onClick={handleSortableClickWith(SortBy.LIKES)}
          >
            좋아요
            <span
              className={clsx(sortableIcon, {
                [notSorted]: sortBy !== SortBy.LIKES,
              })}
            >
              <FiArrowDown />
            </span>
          </a>
        </div>
        <div className={postListRow.views}>
          <a
            className={clsx(sortableLink, postListLinks)}
            href="#"
            onClick={handleSortableClickWith(SortBy.VIEWS)}
          >
            조회
            <span
              className={clsx(sortableIcon, {
                [notSorted]: sortBy !== SortBy.VIEWS,
              })}
            >
              <FiArrowDown />
            </span>
          </a>
        </div>
      </div>

      <div className={postListBody}>
        {posts.length > 0 ? (
          posts.map((postHeader) => (
            <Link
              key={postHeader.id}
              className={clsx(postListLinks, postListRow.container)}
              to={`/post/${postHeader.id}`}
            >
              <div className={postListRow.title}>{postHeader.title}</div>
              <div className={postListRow.author}>
                {postHeader.author_nickname}
              </div>
              <div className={postListRow.created_at}>
                {dateToStr(postHeader.created_at)}
              </div>
              <div className={postListRow.likes}>{postHeader.likes}</div>
              <div className={postListRow.views}>{postHeader.views}</div>
            </Link>
          ))
        ) : (
          <p className={noPost}>
            {keyword ? (
              <>“{keyword}”에 대한 검색 결과가 없습니다.</>
            ) : (
              <>
                아직 게시글이 없습니다.
                <br />첫 게시글을 작성해 보세요.
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default PostList;
