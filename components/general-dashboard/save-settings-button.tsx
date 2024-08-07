import { Button, Flex, Spinner, Text } from "@chakra-ui/react";

type SaveButtonProps = {
  address: string | undefined;
  isSubmitting: boolean;
  children: React.ReactNode;
};

const ButtonContent = (props: {
  address: string | undefined;
  isSubmitting: boolean;
}) => {
  return (
    <Flex
      alignItems={"center"}
      justifyContent={"center"}
      gap={2.5}
      color={!props.address ? "black" : "white"}
    >
      {props.isSubmitting && (
        <Spinner color="white" size={"sm"} speed="0.65s" />
      )}
      <Text fontFamily={"Poppins Semibold"} fontSize={14}>
        {props.isSubmitting ? "Saving..." : "Save"}
      </Text>
    </Flex>
  );
};

const SaveButton = (props: SaveButtonProps) => {
  return (
    <Button
      type="submit"
      variant={"unstyled"}
      bg={
        !props.address
          ? "gray.500"
          : "linear-gradient(90deg, #B14CE7 0%, #E09CA4 100%)"
      }
      borderRadius={"full"}
      paddingX={12}
      paddingY={3}
      height="36px"
      display={"flex"}
      alignItems="center"
      justifyContent="center"
      isDisabled={props.isSubmitting ?? !props.address}
      _hover={{
        opacity: !props.address ? "" : "0.8"
      }}
      width="100%"
      zIndex={10}
      maxWidth="550px"
    >
      <ButtonContent
        isSubmitting={props.isSubmitting}
        address={props.address}
      />
    </Button>
  );
};

export default SaveButton;
