import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import instance from "../../axios";
import { ProductType } from "../../constants/Product";
import { Avatar, Box, Button, Container } from "@mui/material";
import styled from "styled-components";
import Slider from "react-slick";
import IncrementInput from "../IncrementInput";
import useTextFormatting from "../../hooks/useFormatText";
import { Chat, ShoppingCart, Store } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { getUser } from "../../redux/userReducer";

const ProductContainer = styled(Container)`
    .Product_wrapper {
        margin-top: 16px;
        background-color: white;
        padding: 8px;
        border-radius: 5px;
        display: flex;
        flex-wrap: wrap;
    }
    .Product_thumbnail {
        display: flex;
        flex-direction: column;
        width: 60%;
        padding: 0 24px;
        background-color: #ddd;
        height: 400px;
        .Product_slider {
            .Slider-item {
                height: 400px;
            }
            .slick-arrow {
                height: 30px;
                width: 30px;
                z-index: 99;
                &.slick-next {
                    transform: translateX(-50%) translateY(-50%);
                }
                &.slick-prev {
                    transform: translateX(50%) translateY(-50%);
                }
                &::before {
                    font-size: 30px;
                    opacity: 1;
                }
                &.slick-disabled:before {
                    opacity: 0.3;
                }
            }
        }
        @media (max-width: 600px) {
            width: 100%;
            height: 240px;
            .Product_slider {
                .Slider-item {
                    height: 240px;
                }
            }
        }
    }
    .Product_info {
        width: 40%;
        padding: 8px;
        position: sticky;
        height: 100%;
        top: calc(var(--header-height) + 16px);
        .Product_name {
            font-size: 18px;
            color: var(--primary);
        }
        .Product_price {
            font-size: 20px;
            color: var(--text-color);
            font-weight: bold;
        }
        .Product_description {
            font-size: 14px;
            opacity: 0.8;
        }

        @media (max-width: 600px) {
            width: 100%;
        }
    }

    @media (min-width: 900px) {
        &.MuiContainer-root {
            padding: 0 100px;
        }
    }
`;
const sliderSettings = {
    infinite: true,
    arrows: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};
const OneProduct = () => {
    const [product, setProduct] = useState<ProductType | null>(null);
    const { productId } = useParams();
    const [quantity, setQuantity] = useState<number>(1);
    const { convertPriceFormat } = useTextFormatting();
    const userState = useSelector(getUser);
    useEffect(() => {
        instance
            .get(`/public/product/${productId}`)
            .then((res) => setProduct(res.data));
    }, [productId]);
    const handleClickAddToCart = () => {
        userState &&
            product &&
            instance.post("/user/cart", {
                productId: product.id,
                quantity: quantity,
            });
    };
    return product ? (
        <ProductContainer>
            <Box className="Product_wrapper">
                <Box className="Product_thumbnail">
                    <Box className="Product_slider">
                        <Slider {...sliderSettings}>
                            {product.images.map((image) => (
                                <Box className="Slider-item">
                                    <img
                                        style={{
                                            backgroundColor: "#ddd",
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "contain",
                                        }}
                                        src={image}
                                    />
                                </Box>
                            ))}
                        </Slider>
                    </Box>
                </Box>
                <Box className="Product_info">
                    <h3 className="Product_name">{product.name}</h3>
                    <Box
                        sx={{
                            marginTop: 3,
                            marginBottom: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 3,
                            padding: 2,
                            backgroundColor: "#f0f0f0",
                        }}>
                        <span className="Product_price">
                            {convertPriceFormat(product.price)}
                        </span>
                    </Box>
                    <p className="Product_description">{product.description}</p>
                    <Box
                        sx={{
                            marginTop: 5,
                            marginBottom: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}>
                        <span style={{ fontSize: "14px", opacity: 0.8 }}>
                            Quantity:
                        </span>
                        <IncrementInput
                            value={quantity}
                            setValue={setQuantity}
                            maxValue={Number(product.quantity)}
                        />
                        <span style={{ fontSize: "14px", opacity: 0.8 }}>
                            {product.quantity} products are available
                        </span>
                    </Box>
                    <Box
                        sx={{
                            marginTop: 3,
                            marginBottom: 3,
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                        }}>
                        <Button variant="contained">Buy product</Button>
                        <Button
                            variant="outlined"
                            onClick={handleClickAddToCart}
                            startIcon={<ShoppingCart />}
                            disabled={!userState}>
                            Add to cart
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            padding: "8px 0",
                            borderTop: "1px solid #ccc",
                            display: "flex",
                            gap: "16px",
                        }}>
                        <Avatar
                            sx={{
                                height: "60px",
                                width: "60px",
                                border: "1px solid #ccc",
                            }}
                            src="https://invietnhat.vn/wp-content/uploads/2023/08/logo-shop-thoi-trang-nu-6.jpg"
                        />
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                gap: "8px",
                            }}>
                            <h3 style={{ fontSize: "16px", fontWeight: 600 }}>
                                {product.shop.name}
                            </h3>
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: "8px",
                                }}>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    component={Link}
                                    to={`/shop/${product.shop.id}`}
                                    startIcon={<Store />}>
                                    View Shop
                                </Button>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    component={Link}
                                    to={`/chat?username=${product.shop.owner.username}`}
                                    startIcon={<Chat />}
                                    disabled={
                                        (userState &&
                                            product.shop.owner.username ===
                                                userState.username)!
                                    }>
                                    Chat now
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </ProductContainer>
    ) : (
        <h1>Loading ...</h1>
    );
};

export default OneProduct;
