import React from "react";
import { Button } from "@chakra-ui/react";

type CustomStyle = {
  [key: string]: string | number;
};

interface LinearButtonProps {
  onClick: () => void;
  isDisabled?: boolean;
  children: React.ReactNode;
  customStyle?: CustomStyle;
  isConfirming?: boolean;
  isAccept?: boolean;
}

const LinearButton: React.FC<LinearButtonProps> = ({
  onClick,
  children,
  customStyle,
  isConfirming,
  isDisabled,
  isAccept
}) => {
  return (
    <Button
      onClick={onClick}
      variant={"unstyled"}
      bg={"linear-gradient(90deg, #b24fe4, #e09da3)"}
      color={"white"}
      borderRadius={"full"}
      paddingY={5}
      display={"flex"}
      isDisabled={isConfirming ?? isDisabled}
      _hover={{
        opacity: isDisabled ? "" : "0.8"
      }}
      fontFamily={"Poppins Semibold"}
      fontSize={16}
      fontWeight={600}
      maxWidth={{
        base: isAccept ? "100px" : "auto",
        md: isAccept ? "274px" : "auto"
      }}
      {...customStyle}
    >
      {children}
    </Button>
  );
};

export default LinearButton;
