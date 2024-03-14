import React, { ElementType, useContext, useEffect, useRef } from "react";
import { useState } from "react";
import {
    Box,
    Card as CardMUI,
    Checkbox,
    IconButton,
    ListItem,
} from "@mui/material";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Menu from "./Menu";
import {
    MoreHoriz,
    ChatBubbleOutline,
    DeleteForever,
    MoreVert,
    Delete,
} from "@mui/icons-material";
import instance from "../axios";
import { UserType } from "../redux/userReducer";
import { ProductType } from "../constants/Product";
import { ShopContext } from "./layout/OwnLayout";
import useTextFormatting from "../hooks/useFormatText";
import { CartDetailType, ShopCartType } from "../constants/Cart";
import IncrementInput from "./IncrementInput";
import useSetValueTimeout from "../hooks/useSetValueTimeout";
import { OrderDetailType } from "../constants/Order";

type CardProps = React.PropsWithChildren<{
    size?: "small" | "medium" | "large";
    color?: "primary" | "secondary";
    column: number;
    columnPhone?: number;
    columnTablet?: number;
    minWidth?: number;
}> &
    React.HTMLAttributes<HTMLButtonElement>;

type StyledCardProps = {
    $column: number;
    $color?: "primary" | "secondary";
    $minWidth?: number;
    $size?: "small" | "medium" | "large";
    $columnPhone?: number;
    $columnTablet?: number;
};

const StyledCard = styled(CardMUI)<StyledCardProps>`
    &.MuiCard-root {
        overflow: visible;
        width: ${(props) => `calc(100% / ${props.$column})`};
        min-width: ${(props) => `${props.$minWidth}px`};
        padding: ${(props) =>
            props.$size === "large"
                ? "24px 16px"
                : props.$size === "medium"
                ? "12px 8px"
                : "6px 4px"};
        border-radius: 5px;
        box-shadow: 0px 4px 4px 4px
            rgba(
                ${(props) =>
                    props.$color === "primary"
                        ? "var(--primaryRGB)"
                        : props.$color === "secondary"
                        ? "var(--secondaryRGB)"
                        : "0,0,0"},
                0.1
            );
    }
    @media (max-width: 900px) {
        &.MuiCard-root {
            width: ${(props) =>
                props.$columnPhone
                    ? `calc(100% / ${props.$columnTablet})`
                    : "100%"};
        }
    }
    @media (max-width: 600px) {
        &.MuiCard-root {
            width: ${(props) =>
                props.$columnPhone
                    ? `calc(100% / ${props.$columnPhone})`
                    : "100%"};
        }
    }
`;

const Card = React.memo(
    ({
        size = "medium",
        color,
        column,
        columnTablet,
        columnPhone,
        children,
    }: CardProps) => {
        return (
            <StyledCard
                $size={size}
                $color={color}
                $column={column}
                $columnTablet={columnTablet}
                $columnPhone={columnPhone}>
                {children}
            </StyledCard>
        );
    }
);

type CardFriendProps = React.PropsWithChildren<{
    friend: UserType;
}>;

const StyledCardFriend = styled(CardMUI)`
    &.MuiCard-root {
        padding: 8px;
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 16px;
        box-shadow: none;
        border: 1px solid #eee;
        .card-friend_thumbnail {
            padding: 4px;
            width: 80px;
            height: 80px;

            img {
                width: 100%;
                height: 100%;
                border-radius: 4px;
            }
        }
        .card-friend_info {
            flex: 1;
            display: flex;
            align-items: center;
            h3 {
                color: var(--black);
            }
        }
        .card-friend_menu {
            display: flex;
            align-items: center;
        }
    }
`;

export const CardFriend = ({ friend }: CardFriendProps) => {
    const [anchorElMenu, setAnchorElMenu] = useState<HTMLElement | null>(null);
    const cardFriedRef = useRef<HTMLDivElement>(null);

    const handleDeleteFriend = () => {
        instance
            .delete(`/user/friend?username=${friend.username}`)
            .then(() => cardFriedRef?.current?.remove())
            .catch((e) => {
                console.log(e);
            });
    };
    return (
        <StyledCardFriend ref={cardFriedRef}>
            <div className="card-friend_thumbnail">
                <img src={friend.avatar} />
            </div>
            <div className="card-friend_info">
                <Link to={`/user?username=${friend.username}`}>
                    <h3>{friend.name}</h3>
                </Link>
            </div>
            <div className="card-friend_menu">
                <IconButton onClick={(e) => setAnchorElMenu(e.currentTarget)}>
                    <MoreHoriz />
                </IconButton>
                <Menu
                    menu={{
                        title: "Menu",
                        list: [
                            {
                                title: "Chat",
                                to: `/chat?username=${friend.username}`,
                                Icon: <ChatBubbleOutline />,
                                divider: true,
                            },
                            {
                                title: "Delete friend",
                                handleClick: handleDeleteFriend,
                                Icon: <DeleteForever />,
                            },
                        ],
                    }}
                    anchorEl={anchorElMenu}
                    open={Boolean(anchorElMenu)}
                    handleClose={() => setAnchorElMenu(null)}
                />
            </div>
        </StyledCardFriend>
    );
};

type CardProductProps = React.PropsWithChildren<{
    product: ProductType;
    component?: React.ElementType;
    to?: string;
    isSetting?: boolean;
    handleClickDeleteCard?: () => void;
}>;

const StyledCardProduct = styled.div`
    margin: 0;
    padding: 6px 8px;
    width: 100%;
    position: relative;
    transition: 0.3s all linear;
    border: 1px solid transparent;
    display: flex;
    flex-direction: column;
    justify-content: center;
    .CardProduct_thumbnail {
        flex: 1;
        position: relative;
        text-align: center;
        width: 100%;
        height: 160px;
        img {
            height: 100%;
            width: 100%;
            object-fit: contain;
        }
        .CardProduct_note {
            height: 16px;
            padding: 2px 4px 2px;
            font-size: 12px;
            color: white;
            background-color: var(--secondary);
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            transform: translateX(-4px) translateY(4px);
            top: 0;
            right: 0;
        }

        @media (max-width: 900px) {
            height: 120px;
            .CardProduct_note {
                height: 12px;
                font-size: 10px;
            }
        }
        @media (max-width: 600px) {
            height: 100px;
            .CardProduct_note {
                height: 10px;
                font-size: 8px;
            }
        }
    }

    .CardProduct_info {
        h3 {
            text-align: left;
            color: black;
            line-height: 1.2;
            margin: 8px 0 4px;
            font-size: 14px;
            font-weight: 500;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .CardProduct_price {
            float: left;
            color: var(--secondary);
            font-size: 14px;
            font-weight: 500;
        }
        .CardProduct_sold {
            float: right;
            color: #aaa;
            font-size: 14px;
            font-weight: 500;
        }
    }
    .CardProduct_setting {
        position: absolute;
        opacity: 0;
        top: 0;
        right: 0;
        z-index: 1000;
        transform: translateX(-10%) translateY(10%);
        .MuiIconButton-root {
            color: #fff;
        }
    }

    &:hover {
        border: 1px solid var(--secondary);
        .CardProduct_setting {
            opacity: 1;
        }
    }

    @media (max-width: 900px) {
        padding: 6px 8px;
    }
    @media (max-width: 600px) {
        padding: 0;
    }
`;

export const CardProduct = ({
    product,
    component,
    to,
    handleClickDeleteCard,
    isSetting = false,
}: CardProductProps) => {
    let Component: ElementType = "div";
    if (component && !isSetting) {
        Component = component;
    }
    const { convertPriceFormat } = useTextFormatting();
    const [anchorElMenu, setAnchorElMenu] = useState<HTMLElement | null>(null);
    const { shopActive } = useContext(ShopContext);
    return (
        <StyledCardProduct>
            <Component
                {...(component === Link && { to: to })}
                className="CardProduct_content">
                <div className="CardProduct_thumbnail">
                    <img src={product.images[0]} />
                    {product.note && (
                        <div className="CardProduct_note">
                            <span>{product.note}</span>
                        </div>
                    )}
                </div>
                <div className="CardProduct_info">
                    {isSetting && to ? (
                        <Link to={to}>
                            <h3 className="CardProduct_name">{product.name}</h3>
                        </Link>
                    ) : (
                        <h3 className="CardProduct_name">{product.name}</h3>
                    )}

                    <div>
                        <span className="CardProduct_price">
                            {convertPriceFormat(product.price)}
                        </span>
                        <span className="CardProduct_sold">
                            Sold {product.sold}
                        </span>
                    </div>
                </div>
                {isSetting && (
                    <div className="CardProduct_setting">
                        <IconButton
                            onClick={(e) => {
                                e.preventDefault();
                                setAnchorElMenu(e.currentTarget);
                            }}
                            size="small">
                            <MoreVert />
                        </IconButton>
                        <Menu
                            menu={{
                                list: [
                                    {
                                        title: "Edit",
                                        to: `/own/shop/${shopActive?.name}/product/${product.id}/edit`,
                                        divider: true,
                                    },
                                    {
                                        title: "Delete",
                                        handleClick: (e) => {
                                            e.preventDefault();
                                            handleClickDeleteCard &&
                                                handleClickDeleteCard();
                                        },
                                    },
                                ],
                            }}
                            open={Boolean(anchorElMenu)}
                            anchorEl={anchorElMenu}
                            handleClose={() => setAnchorElMenu(null)}
                            size="small"
                        />
                    </div>
                )}
            </Component>
        </StyledCardProduct>
    );
};

type CardCartDetailProps = {
    detail: CartDetailType;
    setShopCarts: React.Dispatch<React.SetStateAction<ShopCartType[]>>;
    checked?: boolean | null;
    handleToggleChecked?: () => void;
};
const StyledCardCartDetail = styled(ListItem)`
    &.MuiListItem-root {
        padding: 8px 4px;
        gap: 8px;
        .cartDetail_thumbnail {
            width: 60px;
            height: 60px;
        }
        > .MuiBox-root {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .cartDetail_info {
            flex: 1;
            gap: 4px;
            .cartDetail_name {
                box-sizing: border-box;
                font-size: 13px;
                line-height: 1;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                line-clamp: 2;
                height: 28px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
    + .MuiListItem-root {
        border-top: 1px solid #ccc;
    }
`;

export const CardCartDetail = ({
    detail,
    setShopCarts,
    checked = null,
    handleToggleChecked = () => {},
}: CardCartDetailProps) => {
    const product = detail.product;
    const newQuantity = useSetValueTimeout(detail.quantity, 2000);
    const [isFistRender, setIsFistRender] = useState<boolean>(true);

    useEffect(() => {
        if (isFistRender) {
            setIsFistRender(false);
        } else
            instance
                .put("/user/cart", {
                    productId: product.id,
                    quantity: newQuantity,
                })
                .then((res) => {
                    console.log(res);
                })
                .catch((err) => {
                    console.log(err);
                });
    }, [newQuantity]);

    const handleChangeQuantity = (
        action: "INCREMENT" | "DECREMENT" | "UPDATE",
        quantity?: number
    ) => {
        setShopCarts((pre) => {
            const newDetails = [...pre];
            const index = newDetails.findIndex((item) =>
                item.details.includes(detail)
            );

            const newCartDetails = newDetails[index]?.details.map(
                (detailPre) => {
                    if (detailPre.product.id === detail.product.id) {
                        switch (action) {
                            case "INCREMENT":
                                detailPre.quantity += 1;
                                break;
                            case "DECREMENT":
                                detailPre.quantity -= 1;
                                break;
                            case "UPDATE":
                                quantity
                                    ? (detailPre.quantity = quantity)
                                    : detailPre.quantity;
                                break;
                        }
                    }
                    return detailPre;
                }
            );
            newDetails[index].details = newCartDetails;
            return newDetails;
        });
    };
    const handleClickDeleteDetail = () => {
        instance.delete(`/user/cart/${product.id}`).then(() => {
            setShopCarts((pre) => {
                const newDetails = [...pre];
                const index = newDetails.findIndex((item) =>
                    item.details.includes(detail)
                );
                const newCartDetails = newDetails[index].details.filter(
                    (detailPre) => detailPre !== detail
                );
                newDetails[index].details = newCartDetails;
                return newDetails;
            });
        });
    };
    return (
        <StyledCardCartDetail>
            {checked !== null && (
                <Box>
                    <Checkbox
                        sx={{
                            "& .MuiSvgIcon-root": {
                                fontSize: "16px",
                            },
                            width: "30px",
                            height: "30px",
                        }}
                        size="small"
                        checked={checked}
                        onChange={handleToggleChecked}
                    />
                </Box>
            )}
            <Box className="cartDetail_thumbnail">
                <img
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                    src={product.images[0]}
                />
            </Box>
            <Box className="cartDetail_info">
                <p className="cartDetail_name">{product.name}</p>
                <Box>
                    <IncrementInput
                        size="small"
                        value={detail.quantity}
                        handleChange={(e) => {
                            handleChangeQuantity(
                                "UPDATE",
                                parseInt(e.target.value)
                            );
                        }}
                        handleIncrement={() =>
                            handleChangeQuantity("INCREMENT")
                        }
                        handleDecrement={() =>
                            handleChangeQuantity("DECREMENT")
                        }
                    />
                    <span
                        style={{
                            marginLeft: "8px",
                            opacity: 0.8,
                            fontSize: "12px",
                        }}>
                        x {product.price.toLocaleString()}
                    </span>
                </Box>
            </Box>
            <Box>
                <IconButton
                    size="small"
                    sx={{
                        width: "30px",
                        height: "30px",
                    }}
                    onClick={handleClickDeleteDetail}>
                    <Delete
                        sx={{
                            fontSize: "20px",
                        }}
                    />
                </IconButton>
            </Box>
        </StyledCardCartDetail>
    );
};

type CardOrderDetailProps = {
    detail: OrderDetailType | CartDetailType;
};

const StyledCardOrderDetail = styled(ListItem)`
    &.MuiListItem-root {
        padding: 8px;
        gap: 8px;
        .cartDetail_thumbnail {
            width: 40px;
            height: 40px;
        }
        > .MuiBox-root {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        .cartDetail_info {
            flex: 1;
            gap: 4px;
            .cartDetail_name {
                box-sizing: border-box;
                font-size: 12px;
                line-height: 1;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                line-clamp: 2;
                overflow: hidden;
                text-overflow: ellipsis;
            }
        }
    }
    + .MuiListItem-root {
        border-top: 1px solid #ccc;
    }
`;

export const CardOrderDetail = ({ detail }: CardOrderDetailProps) => {
    const product = detail.product;
    return (
        <StyledCardOrderDetail>
            <Box className="cartDetail_thumbnail">
                <img
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                    }}
                    src={product.images[0]}
                />
            </Box>
            <Box className="cartDetail_info">
                <p className="cartDetail_name">{product.name}</p>
                <Box sx={{ opacity: 0.8 }}>
                    <span style={{ fontSize: "12px" }}>
                        {detail.quantity +
                            " x " +
                            product.price.toLocaleString() +
                            " đ"}
                    </span>
                </Box>
            </Box>
        </StyledCardOrderDetail>
    );
};

export default Card;
