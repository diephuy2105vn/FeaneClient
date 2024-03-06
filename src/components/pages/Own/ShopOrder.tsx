import {
    Box,
    Button,
    Checkbox,
    Collapse,
    Container,
    FormControl,
    FormControlLabel,
    Hidden,
    IconButton,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    MenuItem,
    OutlinedInput,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { OrderType } from "../../../constants/Order";

import styled from "styled-components";

import Title from "../../Title";
import instance from "../../../axios";
import { ShopContext } from "../../layout/OwnLayout";
import {
    CheckCircle,
    KeyboardArrowDown,
    KeyboardArrowUp,
    Search,
} from "@mui/icons-material";
import useTextFormatting from "../../../hooks/useFormatText";
import { Link } from "react-router-dom";
import Modal, { ModalProps } from "../../Modal";

const StyledContainer = styled(Container)`
    &.MuiContainer-root {
        display: flex;
        flex-direction: row;
        gap: 16px;
        padding-top: 0;
    }
    @media (max-width: 600px) {
        &.MuiContainer-root {
            padding: 0;
        }
    }
`;

export const Row = (props: {
    row: OrderType;
    handleDeleteOrder?: (order: OrderType) => void;
    handleConfirmOrder?: (order: OrderType) => void;
}) => {
    const { row, handleDeleteOrder, handleConfirmOrder } = props;
    const [value, setValue] = useState(row);
    useEffect(() => {
        setValue(row);
    }, [row]);
    const [open, setOpen] = useState(false);
    const { convertDateFormat } = useTextFormatting();
    const { shopActive } = useContext(ShopContext);

    return (
        <>
            <TableRow
                sx={{
                    "& > *": { borderBottom: "unset" },

                    "&:last-child > *": {
                        borderBottom: "unset",
                    },
                }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                </TableCell>
                <TableCell align="center">{value.name}</TableCell>
                <TableCell align="center">{value.phoneNumber}</TableCell>
                <Hidden mdDown>
                    <TableCell align="center">
                        {convertDateFormat(value.createdAt)}
                    </TableCell>
                    <TableCell align="center">
                        <span
                            style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                maxWidth: "400px",
                            }}>
                            {value.address}
                        </span>
                    </TableCell>
                    <TableCell align="center" colSpan={1}>
                        {value.totalPrice?.toLocaleString()}
                    </TableCell>
                </Hidden>
                <TableCell align="center" colSpan={1}>
                    <Link
                        to={`/own/shop/${shopActive?.name}/order/${value.id}`}>
                        See Detail
                    </Link>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell
                    style={{
                        paddingBottom: 0,
                        paddingTop: 0,
                        backgroundColor: "fafafa",
                    }}
                    colSpan={12}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: "8px",
                                    fontSize: "18px",
                                    alignItems: "center",
                                }}>
                                <h3>Detail</h3>
                                {row.status === "CONFIRMED" && (
                                    <CheckCircle color="primary" />
                                )}
                            </Box>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="center">
                                            Product's thumbnail
                                        </TableCell>
                                        <TableCell align="center">
                                            Product's name
                                        </TableCell>
                                        <TableCell align="center">
                                            Quantity
                                        </TableCell>
                                        <Hidden mdDown>
                                            <TableCell align="center">
                                                Total price (đ)
                                            </TableCell>
                                        </Hidden>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {value.orderDetails?.map((detail) => (
                                        <TableRow key={detail.product.name}>
                                            <TableCell align="center">
                                                <img
                                                    style={{
                                                        width: "40px",
                                                        height: "40px",
                                                        objectFit: "contain",
                                                    }}
                                                    src={
                                                        detail.product.images[0]
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <span
                                                    style={{
                                                        display: "-webkit-box",
                                                        WebkitLineClamp: 2,
                                                        WebkitBoxOrient:
                                                            "vertical",
                                                        overflow: "hidden",
                                                        textOverflow:
                                                            "ellipsis",
                                                        maxWidth: "400px",
                                                    }}>
                                                    {detail.product.name}
                                                </span>
                                            </TableCell>
                                            <TableCell align="center">
                                                {detail.quantity}
                                            </TableCell>
                                            <Hidden mdDown>
                                                <TableCell align="center">
                                                    {detail.totalPrice?.toLocaleString()}
                                                </TableCell>
                                            </Hidden>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: "8px",
                                    justifyContent: "flex-end",
                                    marginTop: "8px",
                                }}>
                                {value.status === "UNCONFIRM" &&
                                    handleConfirmOrder && (
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                handleConfirmOrder(row);
                                            }}>
                                            Confirm
                                        </Button>
                                    )}
                                {handleDeleteOrder && (
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            handleDeleteOrder(row);
                                        }}>
                                        Delete
                                    </Button>
                                )}
                            </Box>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const StyledSlidebar = styled(Box)`
    &.MuiBox-root {
        background-color: white;
        padding: 16px;
        width: 20%;
        min-width: 120px;
        display: flex;
        border-radius: 5px;
        flex-direction: column;
        position: -webkit-sticky;
        position: sticky;
        max-height: calc(100vh - 96px);
        top: 80px;
    }
`;

const sorts = [
    { value: "NAME_ASC", title: "Name asc" },
    { value: "NAME_DESC", title: "Name desc" },
    { value: "DATE_ASC", title: "Date asc" },
    { value: "DATE_DESC", title: "Date desc" },
];

const ShopOrder = () => {
    const [orders, setOrders] = useState<OrderType[]>([]);
    const { shopActive } = useContext(ShopContext);
    const [selectChecked, setSelectChecked] = useState<{
        sort: string;
        status: string;
    }>({
        sort: "",
        status: "",
    });
    const [modalProps, setModalProps] = useState<ModalProps | null>(null);

    const handleChangeCheckboxSort = (
        e: React.SyntheticEvent<Element, Event>,
        checked: boolean
    ) => {
        const target = e.target as HTMLInputElement;
        setSelectChecked((pre) => ({
            ...pre,
            sort: checked ? target.value : "",
        }));
    };
    const handleChangeCheckboxStatus = (
        e: React.SyntheticEvent<Element, Event>,
        checked: boolean
    ) => {
        const target = e.target as HTMLInputElement;
        setSelectChecked((pre) => ({
            ...pre,
            status: checked ? target.value : "",
        }));
    };
    useEffect(() => {
        instance
            .get(
                `/own/${shopActive?.name}/order/all?sort=${selectChecked.sort}&&status=${selectChecked.status}`
            )
            .then((res) => {
                console.log(res.data);
                setOrders(res.data);
            });
    }, [selectChecked]);

    const handleConfirmOrder = (order: OrderType) => {
        instance
            .post(`/own/${shopActive?.name}/order/${order.id}/confirm`)
            .then(() => {
                setOrders((pre) =>
                    pre.map((orderPre) => {
                        if (orderPre.id === order.id) {
                            orderPre.status = "CONFIRMED";
                        }
                        return orderPre;
                    })
                );
            });
    };

    const handleDeleteOrder = (order: OrderType) => {
        setModalProps({
            title: "Confirm Delete",
            open: true,
            description: "Are you sure you want to delete order?",
            handleClose: () => {
                setModalProps(null);
            },
            handleConfirm: () => {
                handleConfirmDelete(order);
            },
        });
    };
    const handleConfirmDelete = (order: OrderType) => {
        instance
            .delete(`/own/${shopActive?.name}/order/${order.id}`)
            .then(() => {
                setOrders((pre) =>
                    pre.filter((orderPre) => orderPre.id !== order.id)
                );
            });
    };
    return (
        <StyledContainer>
            <Hidden mdDown>
                <StyledSlidebar>
                    <Box>
                        <TextField
                            sx={{ margin: 0 }}
                            size="small"
                            placeholder="Find product"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton size="small">
                                            <Search />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>

                    <List>
                        <h3 style={{ fontSize: "16px", fontWeight: "600" }}>
                            Sort
                        </h3>
                        {sorts.map((sort) => (
                            <ListItem
                                sx={{
                                    margin: 0,
                                    padding: 0,
                                    paddingRight: 1,
                                }}>
                                <FormControlLabel
                                    sx={{
                                        "& .MuiTypography-root": {
                                            fontSize: "14px",
                                        },
                                        "& .MuiSvgIcon-root": {
                                            fontSize: "16px",
                                        },
                                    }}
                                    value={sort.value}
                                    checked={selectChecked.sort === sort.value}
                                    onChange={handleChangeCheckboxSort}
                                    control={<Checkbox size="small" />}
                                    label={sort.title}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <List>
                        <h3 style={{ fontSize: "16px", fontWeight: "600" }}>
                            Status
                        </h3>

                        <ListItem
                            sx={{
                                margin: 0,
                                padding: 0,
                                paddingRight: 1,
                            }}>
                            <FormControlLabel
                                sx={{
                                    "& .MuiTypography-root": {
                                        fontSize: "14px",
                                    },
                                    "& .MuiSvgIcon-root": {
                                        fontSize: "16px",
                                    },
                                }}
                                value={"CONFIRMED"}
                                checked={selectChecked.status === "CONFIRMED"}
                                onChange={handleChangeCheckboxStatus}
                                control={<Checkbox size="small" />}
                                label={"Confirmed"}
                            />
                        </ListItem>
                        <ListItem
                            sx={{
                                margin: 0,
                                padding: 0,
                                paddingRight: 1,
                            }}>
                            <FormControlLabel
                                sx={{
                                    "& .MuiTypography-root": {
                                        fontSize: "14px",
                                    },
                                    "& .MuiSvgIcon-root": {
                                        fontSize: "16px",
                                    },
                                }}
                                value={"UNCONFIRM"}
                                checked={selectChecked.status === "UNCONFIRM"}
                                onChange={handleChangeCheckboxStatus}
                                control={<Checkbox size="small" />}
                                label={"Unconfirm"}
                            />
                        </ListItem>
                    </List>
                </StyledSlidebar>
            </Hidden>
            <Box
                sx={{
                    flex: "1",
                    backgroundColor: "white",
                    padding: "16px",
                    borderRadius: "5px",
                }}>
                <Title size="small">Order</Title>
                <Hidden mdUp>
                    <Box>
                        <FormControl sx={{ m: 1, width: 80 }} size="small">
                            <InputLabel>Sort</InputLabel>
                            <Select
                                value={selectChecked.sort}
                                input={<OutlinedInput label="Sort" />}
                                renderValue={(selected) =>
                                    sorts.find(
                                        (sort) => sort.value === selected
                                    )?.title || ""
                                }>
                                {sorts.map((sort, index) => (
                                    <MenuItem key={index} value={sort.value}>
                                        <FormControlLabel
                                            sx={{
                                                "& .MuiTypography-root": {
                                                    fontSize: "14px",
                                                },
                                                "& .MuiSvgIcon-root": {
                                                    fontSize: "16px",
                                                },
                                            }}
                                            value={sort.value}
                                            checked={
                                                selectChecked.sort ===
                                                sort.value
                                            }
                                            onChange={handleChangeCheckboxSort}
                                            control={<Checkbox size="small" />}
                                            label={sort.title}
                                        />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, width: 80 }} size="small">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={selectChecked.status}
                                input={<OutlinedInput label="Sort" />}
                                renderValue={(selected) => selected}>
                                <MenuItem>
                                    <FormControlLabel
                                        sx={{
                                            "& .MuiTypography-root": {
                                                fontSize: "14px",
                                            },
                                            "& .MuiSvgIcon-root": {
                                                fontSize: "16px",
                                            },
                                        }}
                                        value={"UNCONFIRM"}
                                        checked={
                                            selectChecked.status === "UNCONFIRM"
                                        }
                                        onChange={handleChangeCheckboxStatus}
                                        control={<Checkbox size="small" />}
                                        label={"Unconfirm"}
                                    />
                                </MenuItem>
                                <MenuItem>
                                    <FormControlLabel
                                        sx={{
                                            "& .MuiTypography-root": {
                                                fontSize: "14px",
                                            },
                                            "& .MuiSvgIcon-root": {
                                                fontSize: "16px",
                                            },
                                        }}
                                        value={"CONFIRMED"}
                                        checked={
                                            selectChecked.status === "CONFIRMED"
                                        }
                                        onChange={handleChangeCheckboxStatus}
                                        control={<Checkbox size="small" />}
                                        label={"Confirmed"}
                                    />
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Hidden>
                <TableContainer>
                    <Table
                        sx={{
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            borderCollapse: "inherit",
                            ".MuiTableCell-root": {
                                padding: "8px",
                            },
                        }}>
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell align="center">Name</TableCell>
                                <TableCell align="center">
                                    Phone number
                                </TableCell>
                                <Hidden mdDown>
                                    <TableCell align="center">
                                        Created at
                                    </TableCell>

                                    <TableCell align="center">
                                        Address
                                    </TableCell>

                                    <TableCell align="center">
                                        Total price (đ)
                                    </TableCell>
                                </Hidden>
                                <TableCell align="center">Detail</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders.map((row, index) => (
                                <Row
                                    key={index}
                                    row={row}
                                    handleConfirmOrder={handleConfirmOrder}
                                    handleDeleteOrder={handleDeleteOrder}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            {modalProps && <Modal {...modalProps} />}
        </StyledContainer>
    );
};

export default ShopOrder;
