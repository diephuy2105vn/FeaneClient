import { useEffect, useState } from "react";
import Card from "../../Card";
import {
    Box,
    Hidden,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import Title from "../../Title";
import { Row } from "../Own/ShopOrder";
import instance from "../../../axios";
import { OrderType } from "../../../constants/Order";

const Orders = () => {
    const [orders, setOrders] = useState<OrderType[]>([]);

    useEffect(() => {
        instance.get("/user/order/all").then((res) => setOrders(res.data));
    }, []);

    return (
        <Card column={1}>
            <Box
                sx={{
                    flex: "1",
                    backgroundColor: "white",
                    padding: "16px",
                    borderRadius: "5px",
                }}>
                <Title size="small">Order</Title>

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
                                <Row key={index} row={row} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Card>
    );
};

export default Orders;
