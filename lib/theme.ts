import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
  fonts: {
    heading: `'Amiri', sans-serif`,
    body: `'Amiri', serif`
  },
  colors: {
    background: {
      1: "#fffafa",
      2: "#fffafa",
      3: "#fffafa",
      4: "#fffafa",
      5: "#fffafa",
      6: "#fffafa",
      7: "#fffafa",
      8: "#fffafa",
      9: "#fffafa",
      10: "#fffafa",
      11: "#fffafa",
      12: "#fffafa",
      13: "#fffafa",
      14: "#fffafa",
      15: "#fffafa",
      16: "#fffafa",
      17: "#fffafa",
      18: "#fffafa",
      19: "#fffafa",
      20: "#fffafa",
      21: "#fffafa",
      22: "#fffafa",
      23: "#fffafa"
    },
    foreground: {
      1: "#f2bebe",
      2: "#f2bebe",
      3: "#f2bebe",
      4: "#f2bebe",
      5: "#f2bebe",
      6: "#f2bebe",
      7: "#f2bebe",
      8: "#f2bebe",
      9: "#f2bebe",
      10: "#f2bebe",
      11: "#f2bebe",
      12: "#f2bebe",
      13: "#f2bebe",
      14: "#f2bebe",
      15: "#f2bebe",
      16: "#f2bebe",
      17: "#f2bebe",
      18: "#f2bebe",
      19: "#f2bebe",
      20: "#f2bebe",
      21: "#f2bebe",
      22: "#f2bebe",
      23: "#f2bebe"
    }
  },
  layerStyles: {
    window: {
      h1: {
        color: "#269200",
        fontSize: "48px",
        fontStyle: "italic",
        letterSpacing: "-2%",
        lineHeight: "110%"
      },
      h2: {
        fontSize: "24px",
        fontWeight: "bold",
        letterSpacing: "-1%",
        lineHeight: "110%",
        mt: 10,
        mb: 5,
        textDecoration: "underline",
        textUnderlineOffset: "2px",
        textTransform: "uppercase"
      },
      p: {
        fontSize: "17px"
      },
      "p + p, img + p": {
        mt: 5
      },
      "li + li": {
        mt: 2
      }
    }
  },
  styles: {
    global: {
      "html, body": {
        bg: "background.12",
        color: "#9835BA",
        overscrollBehavior: "none",
        userSelect: "none"
      }
    }
  }
});
