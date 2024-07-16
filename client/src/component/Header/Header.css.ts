import { style } from "@vanilla-extract/css";

// 사이트 최상단에 있을 헤더 스타일 정의
export const header = style({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  height: "50px",
  marginBottom: "20px",
  padding: "0 20px",
  backgroundColor: "#333",
  color: "#fff",
});

export const siteTitle = style({
  fontSize: "24px",
  fontWeight: "bold",
  ":hover": {
    opacity: 0.7,
    cursor: "pointer",
  },
});

export const userAuthPanel = style({
  display: "flex",
  flexDirection: "row",
  gap: "10px",
});

export const nicknameInfo = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  marginRight: "30px",
});

export const iconButtonGroup = style({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  gap: "20px",
});

export const button = style({
  ":hover": {
    opacity: 0.7,
    cursor: "pointer",
  },
});
