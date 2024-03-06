import styled from "styled-components";
import {
    FacebookOutlined,
    Instagram,
    Pinterest,
    Apple,
} from "@mui/icons-material";
import { Container, IconButton } from "@mui/material";
const StyledFooter = styled.div`
    margin-top: 100px;
    height: auto;
    position: relative;
    background-color: #c5a7d9;
    padding: 8px 0;
    .Custom-Shape-divider-bottom {
        position: absolute;
        top: -79px;
        left: 0;
        width: 100%;
        overflow: hidden;
        line-height: 0;
        svg {
            position: relative;
            display: block;
            width: calc(100% + 1.3px);
            height: 80px;
            transform: rotateY(180deg);
        }

        .Shape-fill {
            fill: #c5a7d9;
        }
    }
    .Footer-Info {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        color: #5a4d64;
        font-size: 14px;
        text-align: center;
        p {
            font-style: italic;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        h3 {
            margin-top: 8px;
        }
        .MuiIconButton-root:hover .MuiSvgIcon-root {
            color: #fff;
        }
    }
`;

const Footer = () => {
    return (
        <StyledFooter>
            <div className="Custom-Shape-divider-bottom">
                <svg
                    data-name="Layer 1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none">
                    <path
                        d="M985.66,92.83C906.67,72,823.78,31,743.84,14.19c-82.26-17.34-168.06-16.33-250.45.39-57.84,11.73-114,31.07-172,41.86A600.21,600.21,0,0,1,0,27.35V120H1200V95.8C1132.19,118.92,1055.71,111.31,985.66,92.83Z"
                        className="Shape-fill"></path>
                </svg>
            </div>
            <Container className="Footer-Info">
                <p>
                    Welcome to Feane, located at 123 ABC Street, XYZ City, LMN
                    Country. We're here to serve you Monday to Friday, from 7AM
                    to 10PM. For inquiries, call us at (123) 456-7890 or send an
                    email to info@feane.com. Stay updated with our latest
                    offerings and events by following Feane on our social media
                    channels. Your support means the world to us.
                </p>
                <h3>
                    Thank you for choosing Feane and for visiting our website!
                </h3>
                <div className="Footer-Icon">
                    <IconButton>
                        <FacebookOutlined fontSize="inherit" />
                    </IconButton>
                    <IconButton>
                        <Instagram fontSize="inherit" />
                    </IconButton>
                    <IconButton>
                        <Pinterest fontSize="inherit" />
                    </IconButton>
                    <IconButton>
                        <Apple fontSize="inherit" />
                    </IconButton>
                </div>
            </Container>
        </StyledFooter>
    );
};

export default Footer;
