import React, { useState, useEffect } from "react";
import styled from "styled-components";
import instance from "../axios";

import Menu, { MenuItemType } from "./Menu";
import { Box, Input, Button, FormGroup, IconButton } from "@mui/material";
import { Add, MoreVert, LocationOn, Edit, Delete } from "@mui/icons-material";
import { AxiosResponse } from "axios";
type DelAddressType = {
    id?: number;
    name: string;
    phoneNumber: string;
    address: string;
    isDefault: boolean | string;
    isEdit?: boolean;
    isNew?: boolean;
};
const StyledFormGroup = styled.div`
    width: 100%;
    padding: 20px;
    border-bottom: 1px solid #ccc;
    position: relative;
    .MuiBox-root {
        font-size: 14px;
        width: 100%;
        margin-bottom: 8px;
        display: flex;
        .MuiInput-root {
            font-size: 14px;
        }
        .MuiInputBase-root {
            &.MuiInput-underline::before {
                border-bottom-color: #ccc;
            }
            &.MuiInput-underline::after {
                border-bottom-color: #ccc;
            }
        }
    }
`;
const StyledMenuDelAddress = styled.div`
    position: absolute;
    top: 0;
    right: 0;
`;

const FormGroupDelAddress = () => {
    const [delAddresses, setDelAddresses] = useState<DelAddressType[]>([]);
    const [anchorElMenuDelAddress, setAnchorElMenuDelAddress] =
        React.useState<null | HTMLElement>(null);
    const [openMenu, setOpenMenu] = useState<number>(-1);

    useEffect(() => {
        instance.get("/user/delAddresses").then((res) =>
            setDelAddresses(() => [
                ...res.data.map((item: DelAddressType) => ({
                    ...item,
                    isDefault:
                        typeof item.isDefault == "string"
                            ? JSON.parse(item.isDefault)
                            : item.isDefault,
                    isEdit: false,
                })),
            ])
        );
    }, []);
    const handleOpenMenuDelAddress = (
        event: React.MouseEvent<HTMLElement>,
        index: number
    ) => {
        setAnchorElMenuDelAddress(event.currentTarget);
        setOpenMenu(index);
    };
    const handleCloseMenuDelAddress = () => {
        setAnchorElMenuDelAddress(null);
        setOpenMenu(-1);
    };

    const handleClickSaveDelAddress = (delAddress: DelAddressType) => {
        instance
            .post("/user/delAddress/createOrUpdate", delAddress)
            .then((res: AxiosResponse) => {
                setDelAddresses((pre) => {
                    console.log(res.data);
                    const newValue: DelAddressType[] = pre.map((item) => {
                        if (item === delAddress) {
                            item = {
                                ...res.data,
                                isDefault: JSON.parse(res.data.isDefault),
                            };
                        }
                        return item;
                    });
                    return newValue;
                });
            });
    };

    const handleClickSetDefaultDelAddress = (delAddress: DelAddressType) => {
        if (delAddress.isDefault) {
            return;
        }
        return instance
            .post("/user/delAddress/setDefault", delAddress)
            .then(() => {
                setDelAddresses((pre) => {
                    const newValue: DelAddressType[] = pre.map((item) => {
                        if (item.isDefault) {
                            item.isDefault = false;
                        }
                        if (delAddress === item) {
                            item.isDefault = true;
                        }
                        return item;
                    });
                    return newValue;
                });
            });
    };
    const handleClickEditDelAddress = (delAddress: DelAddressType) => {
        setDelAddresses((pre) => {
            const newValue: DelAddressType[] = pre.map((item) => {
                if (item === delAddress) {
                    item.isEdit = true;
                }
                return item;
            });
            return newValue;
        });
    };
    const handleClickCreateDelAddress = () => {
        const newAddress: DelAddressType = {
            name: "",
            phoneNumber: "",
            address: "",
            isDefault: false,
            isEdit: true,
            isNew: true,
        };
        setDelAddresses((pre) => [...pre, newAddress]);
    };

    const handleClickDeleteDelAddress = (delAddress: DelAddressType) => {
        delAddress.isNew
            ? setDelAddresses((pre) => {
                  const newValue = pre.filter(
                      (delAddressPre) => delAddressPre !== delAddress
                  );
                  return newValue;
              })
            : instance
                  .delete(`/user/delAddress/delete/${delAddress.id}`)
                  .then(() => {
                      setDelAddresses((pre) => {
                          const newValue = pre.filter(
                              (delAddressPre) => delAddressPre !== delAddress
                          );
                          return newValue;
                      });
                  });
    };

    const getListActions = React.useMemo(
        () => (delAddress: DelAddressType) => {
            const actions: MenuItemType[] = [];
            actions.push({
                title: "Edit",
                Icon: <Edit />,
                handleClick: () => {
                    handleClickEditDelAddress(delAddress);
                },
            });
            if (!delAddress.isDefault) {
                actions.push(
                    {
                        title: "Set default",
                        Icon: <LocationOn />,
                        handleClick: () => {
                            handleClickSetDefaultDelAddress(delAddress);
                        },
                        divider: true,
                    },
                    {
                        title: "Delete",
                        Icon: <Delete />,
                        handleClick: () => {
                            handleClickDeleteDelAddress(delAddress);
                        },
                    }
                );
            }

            return actions;
        },
        [delAddresses]
    );

    return (
        <>
            <Box>
                <h3>Del Address</h3>
            </Box>

            <div>
                {delAddresses.map((delAddress, index) => (
                    <StyledFormGroup key={index}>
                        <FormGroup>
                            <Box>
                                <Input
                                    sx={{
                                        flex: 1,
                                        marginRight: 2,
                                    }}
                                    value={delAddress.name}
                                    onChange={(e) => {
                                        setDelAddresses((pre) => {
                                            const newValue: DelAddressType[] = [
                                                ...pre,
                                            ];
                                            newValue[index] = {
                                                ...newValue[index],
                                                name: e.target.value,
                                            };
                                            return newValue;
                                        });
                                    }}
                                    placeholder="Your name"
                                    readOnly={!delAddress.isEdit}
                                    spellCheck={false}
                                />
                                <Input
                                    sx={{
                                        width: 120,
                                    }}
                                    value={delAddress.phoneNumber}
                                    onChange={(e) => {
                                        setDelAddresses((pre) => {
                                            const newValue: DelAddressType[] = [
                                                ...pre,
                                            ];
                                            newValue[index] = {
                                                ...newValue[index],
                                                phoneNumber: e.target.value,
                                            };
                                            return newValue;
                                        });
                                    }}
                                    placeholder="Your phone"
                                    readOnly={!delAddress.isEdit}
                                    spellCheck={false}
                                />
                            </Box>
                            <Box>
                                <Input
                                    fullWidth
                                    maxRows={3}
                                    value={delAddress.address}
                                    multiline
                                    onChange={(e) => {
                                        setDelAddresses((pre) => {
                                            const newValue: DelAddressType[] = [
                                                ...pre,
                                            ];
                                            newValue[index] = {
                                                ...newValue[index],
                                                address: e.target.value,
                                            };
                                            return newValue;
                                        });
                                    }}
                                    placeholder="Your address"
                                    readOnly={!delAddress.isEdit}
                                    spellCheck={false}
                                />
                            </Box>
                            {delAddress.isDefault && (
                                <Box>
                                    <Button
                                        startIcon={<LocationOn />}
                                        variant="outlined"
                                        size="small"
                                        disabled>
                                        Default
                                    </Button>
                                </Box>
                            )}
                            {delAddress.isEdit! && (
                                <Box
                                    sx={{
                                        flexDirection: "row-reverse",
                                    }}>
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            handleClickSaveDelAddress(
                                                delAddress
                                            )
                                        }>
                                        Save
                                    </Button>
                                </Box>
                            )}
                            {!delAddress.isEdit && (
                                <StyledMenuDelAddress>
                                    <IconButton
                                        onClick={(e) =>
                                            handleOpenMenuDelAddress(e, index)
                                        }>
                                        <MoreVert sx={{ fontSize: "20px" }} />
                                    </IconButton>
                                    <Menu
                                        anchorEl={anchorElMenuDelAddress}
                                        open={openMenu === index}
                                        handleClose={handleCloseMenuDelAddress}
                                        menu={{
                                            title: "More",
                                            list: getListActions(delAddress),
                                        }}
                                    />
                                </StyledMenuDelAddress>
                            )}
                        </FormGroup>
                    </StyledFormGroup>
                ))}
            </div>
            <Box>
                <Button
                    onClick={handleClickCreateDelAddress}
                    fullWidth
                    variant="text"
                    color="primary"
                    startIcon={<Add />}>
                    Add Delivery Address
                </Button>
            </Box>
        </>
    );
};

export default FormGroupDelAddress;
