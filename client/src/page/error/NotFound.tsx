import React from "react";
import { Link } from "react-router-dom";
import * as styles from "./NotFound.css";
import { TbFileSad } from "react-icons/tb";

const NotFound: React.FC = () => {
	return (
		<div className={styles.container}>
			<div className={styles.content}>
				<div className={styles.logo}>
					<TbFileSad />
				</div>
				<h1 className={styles.title}>
					원하시는 페이지를 찾을 수 없습니다.
				</h1>
				<p className={styles.description}>
					찾으려는 페이지의 주소가 잘못 입력되었거나, 주소의 변경 혹은
					삭제로 인해 사용하실 수 없습니다. 입력하신 페이지의 주소가
					정확한지 다시 한 번 확인해 주세요.
				</p>
				<Link
					to="/"
					className={styles.button}
				>
					메인으로 돌아가기
				</Link>
			</div>
			<div className={styles.backgroundText}>404 Not Found</div>
		</div>
	);
};

export default NotFound;
