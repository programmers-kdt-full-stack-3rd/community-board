import { style } from "@vanilla-extract/css";

export const postListStyle = style({
  display: "flex",
  flexDirection: "column",
  alignItems: "stretch",
  width: "100%",
  borderTop: "2px solid #808080",
  borderBottom: "2px solid #808080",
  lineHeight: "1.3",
});

export const postListLinks = style({
  color: "inherit",
  fontWeight: "inherit",

  ":hover": {
    backgroundColor: "#8080800a",
    color: "inherit",
    fontWeight: "inherit",
  },
});

export const postListHeaderRow = style({
  fontSize: "0.9rem",
  fontWeight: "bold",
  opacity: 0.8,
});

export const sortableLink = style({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  columnGap: "2px",

  selectors: {
    [`&${postListLinks}:hover`]: {
      backgroundColor: "transparent",
    },
  },
});

export const sortableIcon = style({
  display: "flex",
  alignItems: "center",
  marginLeft: "2px",
  color: "#808080",
});

export const notSorted = style({
  opacity: "0.3",
});

export const postListBody = style({
  display: "flex",
  flexDirection: "column",
});

export const postListRow = {
  container: style({
    display: "flex",
    boxSizing: "border-box",
    columnGap: "8px",
    alignItems: "center",
    borderTop: "1px solid #80808040",
    borderBottom: "1px solid #80808040",
    padding: "4px 0 4px 8px",
    minHeight: "48px",

    ":first-child": {
      borderTopWidth: "0",
    },

    ":last-child": {
      borderBottomWidth: "0",
    },

    selectors: {
      [`&${postListHeaderRow}`]: {
        borderBottom: "2px solid #808080",
        minHeight: "32px",
      },
    },
  }),

  title: style({
    flex: "1 1",
    textAlign: "left",

    selectors: {
      [`${postListHeaderRow} &`]: {
        textAlign: "center",
      },
    },
  }),

  author: style({
    flex: "0 0 96px",
    fontSize: "0.9rem",
  }),

  created_at: style({
    flex: "0 0 96px",
    fontSize: "0.9rem",
  }),

  likes: style({
    flex: "0 0 64px",
  }),

  views: style({
    flex: "0 0 64px",
  }),
};
