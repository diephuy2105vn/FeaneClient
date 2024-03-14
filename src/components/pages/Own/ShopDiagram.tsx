import {
    Box,
    Checkbox,
    Container,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
    SelectChangeEvent,
} from "@mui/material";
import styled from "styled-components";
import Title from "../../Title";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Legend,
    BarChart,
    Bar,
} from "recharts";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { OrderType } from "../../../constants/Order";
import instance from "../../../axios";
import { ShopContext } from "../../layout/OwnLayout";

const StyledContainer = styled(Container)`
    &.MuiContainer-root {
        display: flex;
        flex-direction: row;
        gap: 16px;
        padding-top: 0;
        flex-wrap: wrap;
    }
    @media (max-width: 600px) {
        &.MuiContainer-root {
            padding: 0;
        }
    }
`;

const timeFrames = [
    { value: "ALL", title: "All" },
    { value: "YEAR", title: "By year" },
    { value: "MONTH", title: "By month" },
    { value: "WEEK", title: "By week" },
];

const ShopDiagram = () => {
    const [selectChecked, setSelectChecked] = React.useState<{
        timeFrame: string;
    }>({
        timeFrame: "ALL",
    });

    const [orders, setOrders] = useState<OrderType[]>([]);
    const handleChangeCheckboxTimeFrame = (e: SelectChangeEvent<string>) => {
        const target = e.target as HTMLInputElement;
        const checked = target.value ? true : false;
        setSelectChecked((pre) => ({
            ...pre,
            timeFrame: checked ? target.value : "",
        }));
    };

    const { shopActive } = useContext(ShopContext);
    useEffect(() => {
        instance
            .get(`/own/${shopActive?.name}/order/all`)
            .then((res) => {
                setOrders(res.data);
            })
            .catch((err) => console.log(err));
    }, []);

    const revenueData = useMemo(() => {
        const totalsByDate: { createdAt: string; totalPrice: number }[] = [];
        orders.forEach((order) => {
            const orderDate = new Date(order.createdAt);
            let dateKey = "";
            switch (selectChecked.timeFrame) {
                case "ALL":
                    dateKey = `${orderDate.getFullYear()}`;
                    break;
                case "YEAR":
                    dateKey = `${orderDate.getMonth() + 1}
                    /${orderDate.getFullYear()}`;
                    break;
                case "MONTH":
                    dateKey = `${orderDate.getDate()}/${
                        orderDate.getMonth() + 1
                    }/${orderDate.getFullYear()}`;
                    break;
                case "WEEK":
                    dateKey = `${orderDate.getDate()}/
                    ${orderDate.getMonth() + 1}/${orderDate.getFullYear()}`;
                    break;
            }
            const totalObj = totalsByDate.find(
                (obj) => obj.createdAt === dateKey
            );
            if (totalObj) {
                return (totalObj.totalPrice += order.totalPrice || 0);
            }
            return totalsByDate.push({
                createdAt: dateKey,
                totalPrice: order.totalPrice || 0,
            });
        });

        return totalsByDate;
    }, [orders, selectChecked.timeFrame]);
    const productTopData = useMemo(() => {
        const totalsByName: { name: string; sold: number }[] = [];
        orders.forEach((order) => {
            order.orderDetails.forEach((orderDetail) => {
                const dateKey = orderDetail.product.name;
                const totalObj = totalsByName.find(
                    (obj) => obj.name === dateKey
                );
                if (totalObj) {
                    return (totalObj.sold += orderDetail.quantity);
                }
                return totalsByName.push({
                    name: dateKey,
                    sold: orderDetail.quantity || 0,
                });
            });
        });
        return totalsByName;
    }, [orders, selectChecked.timeFrame]);

    return (
        <StyledContainer>
            <Box
                sx={{
                    backgroundColor: "white",
                    padding: "16px",
                    borderRadius: "5px",
                    width: "100%",
                }}>
                <Title>Diagram</Title>
                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        gap: "8px",
                        alignItems: "center",
                        paddingBottom: "16px",
                        width: "100%",
                    }}>
                    <FormControl sx={{ m: 1, width: 120 }} size="small">
                        <InputLabel>Time frame</InputLabel>
                        <Select
                            value={selectChecked.timeFrame}
                            input={<OutlinedInput label="Time frame" />}
                            onChange={handleChangeCheckboxTimeFrame}
                            renderValue={(selected) =>
                                timeFrames.find(
                                    (timeFrame) => timeFrame.value === selected
                                )?.title || ""
                            }>
                            {timeFrames.map((timeFrame) => (
                                <MenuItem
                                    key={timeFrame.value}
                                    value={timeFrame.value}>
                                    <FormControlLabel
                                        sx={{
                                            "& .MuiTypography-root": {
                                                fontSize: "14px",
                                            },
                                            "& .MuiSvgIcon-root": {
                                                fontSize: "16px",
                                            },
                                        }}
                                        value={timeFrame.value}
                                        checked={
                                            selectChecked.timeFrame ===
                                            timeFrame.value
                                        }
                                        control={
                                            <Checkbox
                                                size="small"
                                                checked={
                                                    selectChecked.timeFrame ===
                                                    timeFrame.value
                                                }
                                            />
                                        }
                                        label={timeFrame.title}
                                    />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>

                <Box>
                    <h3>Revenue</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart
                            data={revenueData}
                            margin={{
                                top: 5,
                                bottom: 5,
                                left: 20,
                                right: 5,
                            }}>
                            <XAxis
                                dataKey="createdAt"
                                fontSize={12}
                                interval={0}
                            />
                            <YAxis
                                tickFormatter={(value) =>
                                    value.toLocaleString()
                                }
                                fontSize={12}
                            />
                            <Line
                                type="monotone"
                                dataKey="totalPrice"
                                stroke="#936dcb"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </Box>

                <Box>
                    <h3>Product sold</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={productTopData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="name"
                                tickFormatter={(value) => {
                                    const words = value.split(" ");
                                    const valueNew =
                                        words.length > 5
                                            ? words.slice(0, 5).join(" ") +
                                              "..."
                                            : value;
                                    return valueNew;
                                }}
                                fontSize={10}
                                interval={0}
                            />
                            <YAxis fontSize={10} />
                            <Legend />
                            <Bar dataKey="sold" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </Box>
            </Box>
        </StyledContainer>
    );
};

export default ShopDiagram;
