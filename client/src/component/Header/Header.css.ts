import { style } from "@vanilla-extract/css";

// 사이트 최상단에 있을 헤더 스타일 정의
export const header = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "60px",
  marginBottom: "20px",
  backgroundColor: "#333",
  color: "#fff",
});
