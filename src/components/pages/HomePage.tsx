import Banner from "../Banner";
import { CardProduct } from "../Card";
import styled from "styled-components";
import { Box, Button, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { ProductType } from "../../constants/Product";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { ArrowDropDown, GppGood, Moped, Restore } from "@mui/icons-material";
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
    grid-template-columns: repeat(6, 1fr);
    overflow: hidden;
    grid-gap: 8px;
    &.Product-trending {
        max-height: 444px;
    }
    @media (max-width: 900px) {
        grid-template-columns: repeat(4, 1fr);
        &.Product-trending {
            max-height: 360px;
        }
    }
    @media (max-width: 600px) {
        grid-template-columns: repeat(3, 1fr);
        grid-auto-rows: minmax(100px, auto);
        &.Product-trending {
            max-height: 300px;
        }
    }
`;

const PromotionContainer = styled.div`
    flex: 1;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    overflow: hidden;
    grid-gap: 8px;
    max-height: 444px;
    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
        max-height: 360px;
    }
    @media (max-width: 600px) {
        grid-template-columns: repeat(1, 1fr);
        max-height: 300px;
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

const SIZE_PAGE = 12;

const HomePage = () => {
    const [products, setProducts] = useState<ProductType[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalProduct, setTotalProduct] = useState<number>(0);
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
        instance.get(`/public/product/all?page=${currentPage}`).then((res) => {
            if (currentPage === 1) {
                setTotalProduct(res.data.total);
                setProducts(res.data.list);
            } else {
                setProducts((pre) => [...pre, ...res.data.list]);
            }
        });
    }, [currentPage]);

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
                        ALL PRODUCTS
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
                <Box>
                    <ProductContainer>
                        {products.map((product) => (
                            <CardProduct
                                component={Link}
                                to={`/product/${product.id}`}
                                product={product}
                            />
                        ))}
                    </ProductContainer>
                    {currentPage * SIZE_PAGE < totalProduct && (
                        <Button
                            fullWidth
                            size="large"
                            onClick={() => setCurrentPage((pre) => ++pre)}
                            startIcon={<ArrowDropDown />}>
                            Show More
                        </Button>
                    )}
                </Box>
            </Container>
        </>
    );
};

export default HomePage;
