import Banner from "../Banner";
import { CardProduct } from "../Card";
import styled from "styled-components";
import { Box, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { ProductType } from "../../constants/Product";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { GppGood, Moped, Restore } from "@mui/icons-material";
import instance from "../../axios";

const StyledCardShop = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .Shop_thumbnail {
        border: 1px solid #eee;
        width: 60px;
        height: 60px;
        border-radius: 10px;
        overflow: hidden;
        transition: width 0.2s linear;
        img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
    }
    .Shop_name {
        margin-top: 4px;
        font-size: 14px;
        font-weight: 500;
    }
    &:hover {
        .Shop_thumbnail {
            width: 64px;
            height: 64px;
        }
    }
`;

const SliderPromotion = styled(Slider)`
    width: calc(100% / 3);
    margin: auto 0 auto;
    align-items: center;
    .slick-dots {
        bottom: 0;
        transform: translateY(-50%);

        li {
            button {
                &::before {
                    color: white;
                    font-size: 10px;
                }
            }
        }
    }
    @media (max-width: 600px) {
        width: calc((100% / 3) * 2);
    }
`;

const ProductContainer = styled.div`
    display: grid;
    grid-template-columns: auto auto auto auto auto auto;
    overflow: hidden;
    &.Product-trending {
        grid-template-rows: auto auto;
        grid-auto-rows: 0px;
    }
    @media (max-width: 900px) {
        grid-template-columns: auto auto auto auto;
    }
    @media (max-width: 600px) {
        grid-template-columns: auto auto auto;
    }
`;

const PromotionContainer = styled.div`
    flex: 1;
    display: grid;
    grid-template-columns: auto auto auto auto;
    grid-template-rows: auto auto;
    grid-auto-rows: 0px;
    overflow: hidden;
    @media (max-width: 900px) {
        grid-template-columns: auto auto;
    }
    @media (max-width: 600px) {
        grid-template-columns: auto;
    }
`;

const shopSliderSettings = {
    dots: false,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 10,
    slidesToScroll: 5,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
        {
            breakpoint: 900,
            settings: {
                slidesToShow: 7,
                slidesToScroll: 7,
            },
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
            },
        },
    ],
};

const promotionSliderSettings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};

const HomePage = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const shops = [
        {
            name: "Fashion Shop",
            avatar: "https://invietnhat.vn/wp-content/uploads/2023/08/logo-shop-thoi-trang-nu-6.jpg",
            description: "Shop 1 nè ",
        },
        {
            name: "Xinh xinh shop",
            avatar: "https://thietkedd.vn/uploads/media_list/845-thiet-ke-logo-thoi-trang.jpg",
            description: "Shop 1 nè ",
        },
        {
            name: "Online Shop",
            avatar: "https://phuongnamvina.com/img_data/images/lam-logo-ban-hang-online-dep.jpg",
            description: "Shop 1 nè ",
        },
        {
            name: "Shop 1",
            avatar: "https://img.freepik.com/free-vector/hand-drawn-shop-local-logo-design_23-2149575766.jpg?size=338&ext=jpg&ga=GA1.1.1412446893.1705190400&semt=ais",
            description: "Shop 1 nè ",
        },
        {
            name: "Fashion Shop",
            avatar: "https://invietnhat.vn/wp-content/uploads/2023/08/logo-shop-thoi-trang-nu-6.jpg",
            description: "Shop 1 nè ",
        },
        {
            name: "Xinh xinh shop",
            avatar: "https://thietkedd.vn/uploads/media_list/845-thiet-ke-logo-thoi-trang.jpg",
            description: "Shop 1 nè ",
        },
        {
            name: "Online Shop",
            avatar: "https://phuongnamvina.com/img_data/images/lam-logo-ban-hang-online-dep.jpg",
            description: "Shop 1 nè ",
        },
        {
            name: "Shop 1",
            avatar: "https://img.freepik.com/free-vector/hand-drawn-shop-local-logo-design_23-2149575766.jpg?size=338&ext=jpg&ga=GA1.1.1412446893.1705190400&semt=ais",
            description: "Shop 1 nè ",
        },
        {
            name: "Fashion Shop",
            avatar: "https://invietnhat.vn/wp-content/uploads/2023/08/logo-shop-thoi-trang-nu-6.jpg",
            description: "Shop 1 nè ",
        },
        {
            name: "Xinh xinh shop",
            avatar: "https://thietkedd.vn/uploads/media_list/845-thiet-ke-logo-thoi-trang.jpg",
            description: "Shop 1 nè ",
        },
        {
            name: "Online Shop",
            avatar: "https://phuongnamvina.com/img_data/images/lam-logo-ban-hang-online-dep.jpg",
            description: "Shop 1 nè ",
        },
        {
            name: "Shop 1",
            avatar: "https://img.freepik.com/free-vector/hand-drawn-shop-local-logo-design_23-2149575766.jpg?size=338&ext=jpg&ga=GA1.1.1412446893.1705190400&semt=ais",
            description: "Shop 1 nè ",
        },
        {
            name: "Fashion Shop",
            avatar: "https://invietnhat.vn/wp-content/uploads/2023/08/logo-shop-thoi-trang-nu-6.jpg",
            description: "Shop 1 nè ",
        },
        {
            name: "Xinh xinh shop",
            avatar: "https://thietkedd.vn/uploads/media_list/845-thiet-ke-logo-thoi-trang.jpg",
            description: "Shop 1 nè ",
        },
        {
            name: "Online Shop",
            avatar: "https://phuongnamvina.com/img_data/images/lam-logo-ban-hang-online-dep.jpg",
            description: "Shop 1 nè ",
        },
        {
            name: "Shop 1",
            avatar: "https://img.freepik.com/free-vector/hand-drawn-shop-local-logo-design_23-2149575766.jpg?size=338&ext=jpg&ga=GA1.1.1412446893.1705190400&semt=ais",
            description: "Shop 1 nè ",
        },
        {
            name: "Fashion Shop",
            avatar: "https://invietnhat.vn/wp-content/uploads/2023/08/logo-shop-thoi-trang-nu-6.jpg",
            description: "Shop 1 nè ",
        },
        {
            name: "Xinh xinh shop",
            avatar: "https://thietkedd.vn/uploads/media_list/845-thiet-ke-logo-thoi-trang.jpg",
            description: "Shop 1 nè ",
        },
        {
            name: "Online Shop",
            avatar: "https://phuongnamvina.com/img_data/images/lam-logo-ban-hang-online-dep.jpg",
            description: "Shop 1 nè ",
        },
        {
            name: "Shop 1",
            avatar: "https://img.freepik.com/free-vector/hand-drawn-shop-local-logo-design_23-2149575766.jpg?size=338&ext=jpg&ga=GA1.1.1412446893.1705190400&semt=ais",
            description: "Shop 1 nè ",
        },
        {
            name: "Fashion Shop",
            avatar: "https://invietnhat.vn/wp-content/uploads/2023/08/logo-shop-thoi-trang-nu-6.jpg",
            description: "Shop 1 nè ",
        },
    ];

    useEffect(() => {
        instance
            .get("/public/product/all")
            .then((res) => setProducts(res.data));
    }, []);

    return (
        <>
            <Banner />
            <Container
                sx={{
                    backgroundColor: "white",
                    paddingTop: "24px",
                    paddingBottom: "24px",
                    marginBottom: "16px",
                }}>
                <Box
                    sx={{
                        display: "flex",
                        gap: "10px",
                        paddingLeft: "8px",
                        alignItems: "center",
                        marginBottom: "8px",
                        "@media (max-width:600px)": {
                            fontSize: "12px",
                            paddingLeft: "4px",
                            gap: "4px",
                        },
                    }}>
                    <h3
                        style={{
                            borderRight: "1px solid #ccc",
                            paddingRight: "10px",
                            lineHeight: 1.4,
                        }}>
                        FEANE MALL
                    </h3>

                    <span>
                        <GppGood
                            sx={{
                                fontSize: "16px",
                                color: "var(--secondary)",
                                marginRight: "4px",
                                transform: "translateY(2px)",
                            }}
                        />
                        100% genuine product
                    </span>
                </Box>
                <Slider className="Slider-shops" {...shopSliderSettings}>
                    {shops.map((shop, index) => (
                        <div key={index}>
                            <StyledCardShop>
                                <div className="Shop_thumbnail">
                                    <img src={shop.avatar} />
                                </div>
                                <h3 className="Shop_name">{shop.name}</h3>
                            </StyledCardShop>
                        </div>
                    ))}
                </Slider>
            </Container>
            <Container
                sx={{
                    backgroundColor: "white",
                    paddingTop: "24px",
                    paddingBottom: "24px",
                    marginBottom: "16px",
                }}>
                <Box
                    sx={{
                        display: "flex",
                        gap: "10px",
                        paddingLeft: "8px",
                        alignItems: "center",
                        marginBottom: "12px",
                        "@media (max-width:600px)": {
                            fontSize: "12px",
                            paddingLeft: "4px",
                        },
                    }}>
                    <h3
                        style={{
                            borderRight: "1px solid #ccc",
                            paddingRight: "10px",
                            lineHeight: 1.4,
                        }}>
                        TRENDING PRODUCTS
                    </h3>
                    <span>
                        <Restore
                            sx={{
                                fontSize: "16px",
                                color: "var(--secondary)",
                                marginRight: "4px",
                                transform: "translateY(2px)",
                            }}
                        />
                        Return within 1 week
                    </span>
                </Box>
                <ProductContainer className="Product-trending">
                    {products.map((product) => (
                        <CardProduct
                            component={Link}
                            to={`/product/${product.id}`}
                            product={product}
                        />
                    ))}
                </ProductContainer>
            </Container>
            <Container
                sx={{
                    backgroundColor: "white",
                    paddingTop: "24px",
                    paddingBottom: "24px",
                    marginBottom: "16px",
                }}>
                <Box
                    sx={{
                        display: "flex",
                        gap: "10px",
                        paddingLeft: "8px",
                        alignItems: "center",
                        marginBottom: "8px",
                        "@media (max-width:600px)": {
                            fontSize: "12px",
                            paddingLeft: "4px",
                        },
                    }}>
                    <h3
                        style={{
                            borderRight: "1px solid #ccc",
                            paddingRight: "10px",
                            lineHeight: 1.4,
                        }}>
                        Promotion
                    </h3>
                    <span>
                        <Moped
                            sx={{
                                fontSize: "16px",
                                color: "var(--secondary)",
                                marginRight: "4px",
                                transform: "translateY(2px)",
                            }}
                        />
                        Free shipping
                    </span>
                </Box>
                <Box sx={{ display: "flex" }}>
                    <SliderPromotion {...promotionSliderSettings}>
                        <div className="SliderPromotion-item">
                            <Box>
                                <img
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                    src="https://cf.shopee.vn/file/vn-50009109-970fe422610295f0b3a373fe4568c400"
                                />
                            </Box>
                        </div>
                        <div className="SliderPromotion-item">
                            <Box>
                                <img
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "contain",
                                    }}
                                    src="https://cf.shopee.vn/file/vn-50009109-970fe422610295f0b3a373fe4568c400"
                                />
                            </Box>
                        </div>
                    </SliderPromotion>
                    <PromotionContainer>
                        {products.slice(0, 8).map((product) => (
                            <CardProduct
                                component={Link}
                                to={`/product/${product.id}`}
                                product={product}
                            />
                        ))}
                    </PromotionContainer>
                </Box>
            </Container>
            <Container
                sx={{
                    backgroundColor: "white",
                    paddingTop: "24px",
                    paddingBottom: "24px",
                    marginBottom: "16px",
                }}>
                <Box
                    sx={{
                        display: "flex",
                        gap: "10px",
                        paddingLeft: "8px",
                        alignItems: "center",
                        marginBottom: "12px",
                        "@media (max-width:600px)": {
                            fontSize: "12px",
                            paddingLeft: "4px",
                        },
                    }}>
                    <h3
                        style={{
                            borderRight: "1px solid #ccc",
                            paddingRight: "10px",
                            lineHeight: 1.4,
                        }}>
                        TRENDING PRODUCTS
                    </h3>
                    <span>
                        <Restore
                            sx={{
                                fontSize: "16px",
                                color: "var(--secondary)",
                                marginRight: "4px",
                                transform: "translateY(2px)",
                            }}
                        />
                        Return within 1 week
                    </span>
                </Box>
                <ProductContainer>
                    {products.map((product) => (
                        <CardProduct
                            component={Link}
                            to={`/product/${product.id}`}
                            product={product}
                        />
                    ))}
                </ProductContainer>
            </Container>
        </>
    );
};

export default HomePage;
