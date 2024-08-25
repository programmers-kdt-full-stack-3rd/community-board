import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import * as styles from "./Loader.css";
const Loader: React.FC = () => {
	return (
		<div className={styles.containerStyle}>
			<AiOutlineLoading3Quarters className={styles.iconStyle} />
			<p className={styles.textStyle}>잠시만 기다려주세요.</p>
		</div>
	);
};

export default Loader;
