import { Container, Button } from "@mui/material";
import styled from "styled-components";
import BannerImage from "../assets/BannerImage.png";
import Slider from "react-slick";
import { Link } from "react-router-dom";
const StyledBanner = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    height: calc(100vh - var(--header-height));
    max-height: 560px;

    .Banner {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        .Banner-thumbnail {
            flex: 1;
            img {
                float: right;
                width: 50%;
                max-height: 480px;
                object-fit: contain;
            }
        }
    }
    @media (max-width: 600px) {
        height: 280px;
    }
`;

const StyledSlider = styled(Slider)`
    position: absolute;
    left: 0;
    width: 60%;
    min-width: 320px;
    .slick-dots {
        bottom: -32px;
        text-align: left;
        padding: 0 16px;
        li {
            button {
                padding: 0;
                &::before {
                    color: var(--text-color);
                    font-size: 14px;
                }
            }
            + li {
                margin-left: 10px;
            }
        }
    }
`;

const StyledSliderItem = styled.div`
    h1 {
        white-space: nowrap;
        font-size: 56px;
        margin-bottom: 16px;
    }
    p {
        font-size: 16px;
        font-style: italic;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 8px;
    }
    @media (max-width: 600px) {
        h1 {
            font-size: 48px;
        }
    }
`;
const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
};

const Banner = () => {
    return (
        <StyledBanner>
            {/* <div className="Custom-Shape-divider">
                <svg
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none">
                    <path
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                        className="Shape-fill"></path>
                </svg>
            </div> */}
            <Container>
                <div className="Banner">
                    <StyledSlider {...settings}>
                        <StyledSliderItem>
                            <h1>Feane Shop</h1>
                            <p>
                                Feane is an innovative e-commerce platform,
                                offering a wide range of products with a secure
                                payment system. Its user-friendly interface and
                                personalized recommendations provide a seamless
                                and enjoyable shopping experience. Shop with
                                Feane for a future-forward e-commerce
                                experience.
                            </p>
                            <Button component={Link} to="/aboutus">
                                About Us
                            </Button>
                        </StyledSliderItem>
                        <StyledSliderItem>
                            <h1>Feane Unleashed</h1>
                            <p>
                                Feane is your perfect shopping destination. We
                                offer a wide range of services for all your
                                needs. Whether you need fashion or home goods,
                                Feane has it all. We ensure a smooth shopping
                                experience for our customers. Follow us on
                                social media for the latest news and deals. At
                                Feane, your satisfaction is our goal. Thank you
                                for choosing us!
                            </p>
                            <Button component={Link} to="/shop">
                                Shopping Now
                            </Button>
                        </StyledSliderItem>
                    </StyledSlider>
                    <div className="Banner-thumbnail">
                        <img src={BannerImage} />
                    </div>
                </div>
            </Container>
        </StyledBanner>
    );
};

export default Banner;
