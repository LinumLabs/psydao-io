import type { Sale } from "@/lib/types";

import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";

type NftSalesDropdownProps = {
  setSelectedSale: (sale: Sale) => void;
  selectedSale: Sale | undefined;
  whitelistedSales: Sale[] | undefined;
};

const NftSalesDropdown = (props: NftSalesDropdownProps) => {
  return (
    <>
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          variant={"unstyled"}
          display={"flex"}
          alignItems={"center"}
          fontFamily={"Inter Medium"}
          fontSize={"14px"}
          fontWeight={500}
          color={"#585858"}
          border={"1px solid #E9BDBD"}
          borderRadius={"8px"}
          p={"8px 16px"}
        >
          {props.selectedSale
            ? `Batch ${props.selectedSale.batchID}`
            : "Select Batch"}
        </MenuButton>
        <MenuList
          zIndex={10}
          fontFamily={"Inter Medium"}
          fontSize={"14px"}
          color={"#585858"}
        >
          {props.whitelistedSales ? (
            props.whitelistedSales.map((sale) => {
              return (
                <MenuItem
                  key={sale.id}
                  onClick={() => props.setSelectedSale(sale)}
                >
                  Batch {sale.batchID}
                </MenuItem>
              );
            })
          ) : (
            <></>
          )}
        </MenuList>
      </Menu>
    </>
  );
};

export default NftSalesDropdown;
