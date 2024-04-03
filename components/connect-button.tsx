import { Box } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import LinearButton from "./linear-button";
import { useBuyToken } from "hooks/useBuyToken";
import { useSignInWallet } from "hooks/useSignInWallet";
import { useEffect } from "react";
import { customToast } from "./toasts/SwapSuccess";
import { displaySwapSuccess } from "./toasts/displaySwapSuccess";

export const ConnectWalletButton = () => {
  const { buyToken, isBlackListWallet } = useBuyToken();
  const signIn = useSignInWallet();
  const SALE_SUCCESSFUL = true;

  useEffect(() => {
    if (!isBlackListWallet && typeof isBlackListWallet === "boolean") {
      signIn();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBlackListWallet]);

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
        const connected = mounted && account && chain;

        const sendTransactionHandler = async () => {
          displaySwapSuccess(SALE_SUCCESSFUL);
          await buyToken();
          openAccountModal;
        };

        return (
          <Box w="full">
            {(() => {
              if (!connected) {
                return (
                  <LinearButton onClick={openConnectModal}>
                    Connect A Wallet
                  </LinearButton>
                );
              }
              if (chain.unsupported) {
                return (
                  <LinearButton onClick={openConnectModal}>
                    Wrong network
                  </LinearButton>
                );
              }
              return (
                <LinearButton onClick={sendTransactionHandler}>
                  {account.displayName}
                  {account.displayBalance ? ` (${account.displayBalance})` : ""}
                </LinearButton>
              );
            })()}
          </Box>
        );
      }}
    </ConnectButton.Custom>
  );
};
