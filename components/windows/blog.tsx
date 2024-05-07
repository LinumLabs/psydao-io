import { Window } from "components/window";
import Iframe from "../iframe";
import { useWindowManager } from "../window-manager";
import { useMediaQuery } from "@chakra-ui/react";

export const Blog = () => {
  const [isLargerThanMd] = useMediaQuery("(min-width: 768px)");

  const { dispatch, state } = useWindowManager();
  const id = "blog";

  return (
    <Window
      id={id}
      height={{
        base: state.isFullscreen ? "100%" : "80%",
        md: state.isFullscreen ? "100%" : "640px"
      }}
      minHeight={isLargerThanMd ? "500px" : "350px"}
      width={{
        base: state.isFullscreen ? "100%" : "95%",
        md: state.isFullscreen ? "100%" : "665px"
      }}
      minWidth="240px"
      top={{
        base: state.isFullscreen ? "50%" : "46%",
        sm: state.isFullscreen ? "50%" : "46%",
        md: state.isFullscreen ? "50%" : "42%"
      }}
      left={{ base: "50%", lg: state.isFullscreen ? "50%" : "40%" }}
      transform="translate(-50%, -50%)"
      defaultIsOpen
    >
      <Window.TitleBar />
      <Window.Content layerStyle="window" position="relative" zIndex="0" p={0}>
        <Iframe
          src="https://mirror.xyz/0x3ccF80a0f26ED8BC2E11d2a4e0813816048BCA38"
          width="100%"
          height="100%"
          onInferredClick={() => dispatch({ type: "foreground", id })}
        ></Iframe>
      </Window.Content>
    </Window>
  );
};
