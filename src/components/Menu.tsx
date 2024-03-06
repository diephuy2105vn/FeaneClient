import React, { useEffect, useState } from "react";
import {
    Menu as MenuMUI,
    MenuItem,
    Divider,
    IconButton,
    PopoverOrigin,
} from "@mui/material";
import styled from "styled-components";
import { ArrowLeft } from "@mui/icons-material";
import { Link } from "react-router-dom";
export type MenuItemType = {
    title: string;
    Icon?: React.ReactElement;
    handleClick?: (event: React.MouseEvent<HTMLElement>, index: number) => void;
    menu?: {
        title: string;
        list: Array<MenuItemType>;
    };
    to?: string;
    divider?: boolean;
};

type MenuType = {
    title?: string;
    list: MenuItemType[];
};

type MenuProps = React.PropsWithChildren<{
    menu: MenuType;
    open: boolean;
    anchorEl: null | HTMLElement;
    handleClose: () => void;
    anchorOrigin?: PopoverOrigin;
    transformOrigin?: PopoverOrigin;
    size?: string;
}>;

type StyledMenuProps = {
    $size: string;
};

const StyledMenu = styled(MenuMUI)<StyledMenuProps>`
    & .MuiMenu-paper {
        z-index: 999;
        border-radius: 6px;
        min-width: ${(props) => (props.$size == "small" ? `120px;` : `160px;`)};
        color: light;
        box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
            rgba(0, 0, 0, 0.05) 0px 0px 0px 1px,
            rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
            rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
        & .MuiMenu-list {
            margin: 0;
        }
        & .MuiMenuItem-root {
            font-size: ${(props) =>
                props.$size == "small" ? `14px;` : `16px;`};
            font-weight: 600;
            color: var(--text-color);
            & .MuiSvgIcon-root {
                margin-right: 12px;
            }
            & .MuiAvatar-root {
                margin-right: 8px;
            }
            + .MuiDivider-root {
                margin: 0;
            }
        }
    }
    .Menu-header {
        display: flex;
        align-items: center;
        padding: 4px;
        color: var(--text-color);
        font-size: 14px;
        text-align: center;
        font-weight: 600;
        position: relative;
        .MuiIconButton-root {
            position: absolute;
            padding: 4px;
            left: 0;
            transform: translateX(50%);
            color: var(--text-color);
        }
        h3 {
            flex: 1;
            font-weight: 700;
            text-align: center;
        }
    }
`;

const Menu = React.memo(
    ({
        menu,
        open,
        anchorEl,
        handleClose,
        anchorOrigin = {
            vertical: "bottom",
            horizontal: "right",
        },
        transformOrigin = {
            vertical: "top",
            horizontal: "right",
        },
        size = "medium",
    }: MenuProps) => {
        const [menuState, setMenuState] = useState<{
            menu: MenuType;
            parents: Array<MenuType>;
        }>({ menu: menu, parents: [] });

        useEffect(() => {
            setMenuState((pre) => ({ ...pre, menu: menu }));
        }, [menu]);

        return (
            <StyledMenu
                MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                }}
                elevation={0}
                anchorOrigin={anchorOrigin}
                transformOrigin={transformOrigin}
                anchorEl={anchorEl}
                open={open}
                onClose={() => {
                    setMenuState({ menu: menu, parents: [] });
                    handleClose();
                }}
                $size={size}>
                {menuState.menu.title && (
                    <div>
                        <div className="Menu-header">
                            {menuState.parents.length > 0 && (
                                <IconButton
                                    onClick={() => {
                                        if (menuState.parents.length > 0) {
                                            setMenuState((pre) => {
                                                pre.menu =
                                                    pre.parents[
                                                        pre.parents.length - 1
                                                    ];
                                                pre.parents.pop();

                                                return { ...pre };
                                            });
                                        }
                                    }}>
                                    <ArrowLeft />
                                </IconButton>
                            )}
                            <h3>{menuState.menu.title}</h3>
                        </div>
                        <Divider />
                    </div>
                )}
                {menuState.menu.list?.map((item, index) => {
                    return (
                        <div key={index}>
                            <MenuItem
                                onClick={(event) => {
                                    if (item.menu != null) {
                                        const newMenu = item.menu;
                                        setMenuState((pre) => ({
                                            menu: newMenu,
                                            parents: [...pre.parents, pre.menu],
                                        }));
                                    }
                                    item.handleClick &&
                                        item.handleClick(event, index);
                                    !item.menu && handleClose();
                                }}
                                {...(item.to && {
                                    component: Link,
                                    to: item.to,
                                })}
                                disableRipple>
                                {item.Icon}
                                {item.title}
                            </MenuItem>
                            {item.divider && <Divider />}
                        </div>
                    );
                })}
            </StyledMenu>
        );
    }
);

export default Menu;
