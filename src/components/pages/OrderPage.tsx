import { useState, useEffect, useMemo } from "react";

import { Box, Button, Container, TextField } from "@mui/material";
import Card, { CardOrderDetail } from "../Card";
import Title from "../Title";
import instance from "../../axios";
import { ShopCartType } from "../../constants/Cart";
import Modal from "../Modal";
import { useNavigate } from "react-router-dom";

const OrderPage = () => {
    const [order, setOrder] = useState<{
        name: string;
        address: string;
        phoneNumber: string;
        details: ShopCartType[];
        orderByCart: boolean;
    }>({
        name: "",
        address: "",
        phoneNumber: "",
        details: [],
        orderByCart: false,
    });
    const [openModalSucess, setOpenModalSucess] = useState<boolean>(false);
    const navigate = useNavigate();
    useEffect(() => {
        const orderDetailsString: string | null = localStorage.getItem("order");

        if (orderDetailsString) {
            const orderParse = JSON.parse(orderDetailsString);
            setOrder((pre) => ({
                ...pre,
                details: orderParse.orderDetails,
                orderByCart: orderParse.orderByCart,
            }));
        }
    }, []);

    const handleSubmitOrder = () => {
        const orderReq = {
            name: order.name,
            address: order.address,
            phoneNumber: order.phoneNumber,
            details: order.details.map((detail) => ({
                shopId: detail.shop.id,
                cartDetails: detail.details.map((detail) => ({
                    productId: detail.product.id,
                    quantity: detail.quantity,
                })),
            })),
            orderByCart: order.orderByCart,
        };
        instance
            .post("/public/order", orderReq)
            .then(() => setOpenModalSucess(true))
            .catch((err) => console.log(err));
    };
    const handleCallTotalPrice = useMemo(() => {
        return order.details.reduce(
            (preValue, curDetail: ShopCartType) =>
                preValue +
                curDetail.details.reduce(
                    (preValue, curValue) =>
                        preValue +
                        curValue.quantity * Number(curValue.product.price),
                    0
                ),
            0
        );
    }, [order.details]);

    const handleConfirmModalSucess = () => {
        navigate("/");
    };
    const handleCloseModalSucess = () => {
        setOpenModalSucess(false);
    };

    return order.details.length > 0 ? (
        <Container sx={{ display: "flex", justifyContent: "center" }}>
            <Card column={2} columnPhone={1} columnTablet={1} size="large">
                <Title textAlign="center">Order</Title>
                <Box sx={{ padding: "8px 0", borderBottom: "1px solid #ccc" }}>
                    {order.details.map((detail, index) => (
                        <Box key={index + 1}>
                            <Box
                                sx={{
                                    padding: " 4px 8px",
                                    opacity: 0.8,
                                    display: "flex",
                                    gap: "16px",
                                    alignItems: "center",
                                }}>
                                <h3
                                    style={{
                                        fontWeight: 600,
                                        fontSize: "16px",
                                    }}>
                                    {detail.shop.name}
                                </h3>
                            </Box>
                            {detail.details.map((cartDetail, index) => (
                                <CardOrderDetail
                                    key={index + 1}
                                    detail={cartDetail}
                                />
                            ))}
                        </Box>
                    ))}
                    <p
                        style={{
                            padding: "8px",
                        }}>
                        Total price: {handleCallTotalPrice.toLocaleString()} đ
                    </p>
                </Box>
                <Box sx={{ padding: "8px 0" }}>
                    <TextField
                        value={order.name}
                        onChange={(e) =>
                            setOrder((pre) => ({
                                ...pre,
                                name: e.target.value,
                            }))
                        }
                        fullWidth
                        label="Your name"
                    />
                    <TextField
                        value={order.phoneNumber}
                        onChange={(e) =>
                            setOrder((pre) => ({
                                ...pre,
                                phoneNumber: e.target.value,
                            }))
                        }
                        fullWidth
                        label="Your phone number"
                    />
                    <TextField
                        value={order.address}
                        onChange={(e) =>
                            setOrder((pre) => ({
                                ...pre,
                                address: e.target.value,
                            }))
                        }
                        fullWidth
                        label="Your address"
                        rows={3}
                        multiline
                    />
                </Box>
                <Box sx={{ padding: "8px 0" }}>
                    <Button
                        size="large"
                        fullWidth
                        variant="contained"
                        onClick={handleSubmitOrder}>
                        Order Now
                    </Button>
                </Box>
            </Card>
            <Modal
                title="Order Success"
                description="Thank you for trusting us to use our service"
                open={openModalSucess}
                handleClose={handleCloseModalSucess}
                handleConfirm={handleConfirmModalSucess}
            />
        </Container>
    ) : (
        <h1>Can't find your order</h1>
    );
};

export default OrderPage;
