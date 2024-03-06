import { ChatMessageType } from "../constants/ChatMessage";
import { useSelector } from "react-redux";
import { getUser } from "../redux/userReducer";
import styled from "styled-components";
import { Box, IconButton } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import Menu from "./Menu";
import { forwardRef, useState } from "react";
import useTextFormatting from "../hooks/useFormatText";

type ChatMessageProps = {
    message: ChatMessageType;
    handleClickEditMessage: (message: ChatMessageType) => void;
    handleClickDeleteMessage: (message: ChatMessageType) => void;
};

const StyledChatMessage = styled.div`
    .MuiBox-root {
        min-width: 160px;
        min-height: 40px;
        padding: 10px 16px;
        margin: 0;
        max-width: 60%;
        position: relative;
        span {
            width: 100%;
            word-wrap: break-word;
        }
        .message_action {
            opacity: 0;
            position: absolute;
            display: flex;
            align-items: center;
            top: 50%;
            .message_time {
                font-size: 13px;
                font-weight: 500;
                color: white;
                padding: 6px 8px;
                border-radius: 6px;
                background-color: #555;
            }
        }
        &.send {
            float: right;
            border-radius: 20px 20px 4px 20px;
            background-color: rgba(var(--primaryRGB), 0.2);
            .message_action {
                left: 0;
                transform: translateX(calc(-100% - 8px)) translateY(-50%);
            }
        }
        &.receive {
            float: left;
            border-radius: 20px 20px 20px 4px;
            background-color: rgba(var(--secondaryRGB), 0.2);
            .message_action {
                right: 0;
                transform: translateX(calc(100% + 8px)) translateY(-50%);
                flex-direction: row-reverse;
            }
        }
        &:hover .message_action {
            transition: opacity 0.2s linear;
            opacity: 1;
        }
    }
`;

const ChatMessage = forwardRef<HTMLDivElement, ChatMessageProps>(
    ({ message, handleClickEditMessage, handleClickDeleteMessage }, ref) => {
        const userState = useSelector(getUser);
        const [anchorElMenu, setAnchorElMenu] = useState<HTMLElement | null>(
            null
        );

        const { convertTimeFormat } = useTextFormatting();

        return (
            <StyledChatMessage ref={ref}>
                <Box
                    className={
                        userState?.username === message.sender
                            ? "send"
                            : "receive"
                    }>
                    <span>{message.content}</span>
                    <div className="message_action">
                        <span className="message_time">
                            {message.createdAt &&
                                convertTimeFormat(message.createdAt)}
                        </span>
                        {userState?.username === message.sender && (
                            <div className="message_menu">
                                <IconButton
                                    size="small"
                                    onClick={(e) =>
                                        setAnchorElMenu(e.currentTarget)
                                    }>
                                    <MoreVert />
                                </IconButton>
                                <Menu
                                    menu={{
                                        list: [
                                            {
                                                title: "Edit",
                                                handleClick: () => {
                                                    handleClickEditMessage(
                                                        message
                                                    );
                                                },
                                            },
                                            {
                                                title: "Delete",
                                                handleClick: () => {
                                                    handleClickDeleteMessage(
                                                        message
                                                    );
                                                },
                                            },
                                        ],
                                    }}
                                    open={Boolean(anchorElMenu)}
                                    anchorEl={anchorElMenu}
                                    handleClose={() => setAnchorElMenu(null)}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "left",
                                    }}
                                    transformOrigin={{
                                        vertical: "top",
                                        horizontal: "left",
                                    }}
                                    size="small"
                                />
                            </div>
                        )}
                    </div>
                </Box>
            </StyledChatMessage>
        );
    }
);

export default ChatMessage;
