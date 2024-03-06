import { styled as styledMui, useTheme } from "@mui/material/styles";
import MuiAppBar, { AppBarProps as AppBarMuiProps } from "@mui/material/AppBar";
import { useState, FormEvent, useEffect, useRef } from "react";
import styled from "styled-components";
import {
    Toolbar,
    List,
    Box,
    Drawer as DrawerMui,
    CssBaseline,
    CSSObject,
    Theme,
    Divider,
    IconButton,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import {
    Menu as MenuIcon,
    ChevronLeft,
    ChevronRight,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

import { useLocation, useParams } from "react-router-dom";

import instance from "../../axios";
import { ChatRoomType } from "../../constants/ChatRoom";
import { Avatar, TextField } from "@mui/material";
import { Send } from "@mui/icons-material";
import { ChatMessageType, EChatMessage } from "../../constants/ChatMessage";
import SockJS from "sockjs-client";
import Stomp, { Client } from "stompjs";
import { useSelector } from "react-redux";
import { getUser } from "../../redux/userReducer";
import ChatMessage from "../ChatMessage";
import Modal from "../Modal";
const drawerWidth = 280;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: `calc(${theme.spacing(8)} + 1px)`,
    [theme.breakpoints.up("sm")]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styledMui("div")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    minHeight: "64px",
}));

interface AppBarProps extends AppBarMuiProps {
    open?: boolean;
}

const AppBar = styledMui(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
    backgroundColor: "var(--header-background-color)",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),

    ...(open && {
        [theme.breakpoints.up("sm")]: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
        [theme.breakpoints.down("sm")]: {
            zIndex: theme.zIndex.drawer - 1,
        },
    }),
}));

const Drawer = styledMui(DrawerMui, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    boxSizing: "border-box",
    ...(open && {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
        [theme.breakpoints.down("sm")]: {
            position: "absolute",
            width: "100%",
        },
    }),
    ...(!open && {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
    }),
}));
const Logo = styled.h1`
    color: var(--primary);
    font-size: 32px;
    user-select: none;
`;
const StyledChatPage = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    height: calc(100vh - 64px);
    .ChatPage_content {
        padding: 16px 8px;
        width: 100%;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: 8px;
        overflow-y: scroll;
    }
    .ChatPage_footer {
        box-shadow: 0px 2px 4px -1px rgba(0, 0, 0, 0.2),
            0px 4px 5px 0px rgba(0, 0, 0, 0.14),
            0px 1px 10px 0px rgba(0, 0, 0, 0.12);
        height: 64px;
        background-color: #fff;
        margin: auto 0;
        form {
            display: flex;
            align-items: center;
            padding: 0 8px;
            width: 100%;
            gap: 8px;
            .MuiTextField-root {
                flex: 1;
            }
        }
    }
`;

const ChatPage = () => {
    const theme = useTheme();
    const userState = useSelector(getUser);
    const [openSlidebar, setOpenSlidebar] = useState(false);
    const [chatRoomList, setChatRoomList] = useState<ChatRoomType[]>([]);
    const [chatRoomActive, setChatRoomActive] = useState<ChatRoomType | null>(
        null
    );
    const [modal, setModal] = useState({
        title: "",
        description: "",
        open: false,
    });
    const [messageSend, setMessageSend] = useState<ChatMessageType>({
        id: -1,
        sender: "",
        content: "",
        type: EChatMessage.CHAT,
    });
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const usernameQuery = query.get("username");
    const { roomId } = useParams();
    useEffect(() => {
        instance
            .get("/room/getAll")
            .then((res) => {
                return setChatRoomList(res.data);
            })
            .catch((err) => console.log(err));
    }, []);
    const [stompClient, setStompClient] = useState<Client | null>(null);

    const chatMessageRefs = useRef<(HTMLDivElement | null)[]>([]);
    useEffect(() => {
        if (usernameQuery) {
            instance
                .get(`/room?username=${usernameQuery}`)
                .then((res) => {
                    setChatRoomActive(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        if (roomId) {
            instance
                .get(`/room/${roomId}`)
                .then((res) => {
                    setChatRoomActive(res.data);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [usernameQuery, roomId]);

    useEffect(() => {
        const socket = new SockJS("http://localhost:8080/ws");
        const client = Stomp.over(socket);

        if (chatRoomActive && userState) {
            client.connect({}, () => {
                client.subscribe(
                    `/topic/room/${chatRoomActive.id}`,
                    (messageRes) => {
                        const messageBody = JSON.parse(messageRes.body);
                        handleReceiveMessage(messageBody);
                    }
                );
                setMessageSend((pre) => ({
                    ...pre,
                    sender: userState.username,
                }));
                setStompClient(client);
            });
            chatMessageRefs.current[
                chatMessageRefs.current.length - 1
            ]?.scrollIntoView({
                behavior: "smooth",
            });
        }

        return () => {
            if (chatRoomActive && client && client.connected) {
                client.disconnect(() => {});
            }
        };
    }, [chatRoomActive]);

    const sendMessage = (e: FormEvent) => {
        e.preventDefault();
        if (
            messageSend.content.trim() &&
            stompClient &&
            userState &&
            chatRoomActive
        ) {
            stompClient.send(
                `/app/chat/${chatRoomActive.id}/sendMessage`,
                {},
                JSON.stringify(messageSend)
            );

            setMessageSend((pre) => ({
                ...pre,
                content: "",
                type: EChatMessage.CHAT,
            }));
        }
    };

    const handleReceiveMessage = (message: ChatMessageType) => {
        if (message.type == EChatMessage.CHAT) {
            setChatRoomActive((pre) =>
                pre
                    ? {
                          ...pre,
                          messages: [...pre.messages, message],
                      }
                    : null
            );
            return chatMessageRefs.current[
                chatMessageRefs.current.length - 1
            ]?.scrollIntoView({
                behavior: "smooth",
            });
        }
        if (message.type == EChatMessage.DELETE) {
            setChatRoomActive((pre) =>
                pre
                    ? {
                          ...pre,
                          messages: pre?.messages.filter(
                              (messagePre) => messagePre.id !== message.id
                          ),
                      }
                    : null
            );
        }
        if (message.type == EChatMessage.EDIT) {
            setChatRoomActive((pre) =>
                pre
                    ? {
                          ...pre,
                          messages: pre.messages.map((item) => {
                              if (item.id == message.id) {
                                  item.content = message.content;
                              }
                              return item;
                          }),
                      }
                    : null
            );
        }
    };
    const handleClickDeleteMessage = (message: ChatMessageType) => {
        setMessageSend((pre) => ({
            ...pre,
            id: message.id,
            type: EChatMessage.DELETE,
        }));
        setModal({
            title: "Confirm Deletion",
            description:
                "This action cannot be undone, do you confirm deletion?",
            open: true,
        });
    };

    const handleClickEditMessage = (message: ChatMessageType) => {
        setMessageSend((pre) => ({
            ...pre,
            id: message.id,
            content: message.content,
            type: EChatMessage.EDIT,
        }));
    };

    const handleConfirmDeleteMessage = () => {
        stompClient?.send(
            `/app/chat/${chatRoomActive?.id}/sendMessage`,
            {},
            JSON.stringify(messageSend)
        );

        setMessageSend((pre) => ({
            ...pre,
            content: "",
            type: EChatMessage.CHAT,
        }));
    };
    const handleDrawerOpen = () => {
        setOpenSlidebar(true);
    };

    const handleDrawerClose = () => {
        setOpenSlidebar(false);
    };

    return (
        <Box sx={{ display: "flex" }}>
            <CssBaseline />
            <AppBar position="fixed" open={openSlidebar}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{
                            marginRight: 5,
                            ...(openSlidebar && { display: "none" }),
                        }}>
                        <MenuIcon />
                    </IconButton>
                    <Avatar src={chatRoomActive?.receivers[0].avatar} />
                    <h3 style={{ fontSize: "18px", marginLeft: "12px" }}>
                        {chatRoomActive?.receivers[0].name}
                    </h3>
                </Toolbar>
            </AppBar>
            <Drawer variant="permanent" open={openSlidebar}>
                <DrawerHeader>
                    <Link to="/">
                        <Logo>Feane</Logo>
                    </Link>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === "rtl" ? (
                            <ChevronRight />
                        ) : (
                            <ChevronLeft />
                        )}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    {chatRoomList.map((room, index) => (
                        <ListItem
                            key={index}
                            disablePadding
                            sx={{
                                display: "block",
                                backgroundColor:
                                    chatRoomActive?.id === room.id
                                        ? "#eee"
                                        : "transparent",
                                color:
                                    chatRoomActive?.id === room.id
                                        ? "var(--text-color)"
                                        : "black",
                                "&:not(:first-child)": {
                                    borderTop: "1px solid #ccc", // Thêm dòng này
                                },
                            }}>
                            <ListItemButton
                                sx={{
                                    minHeight: 48,
                                    justifyContent: openSlidebar
                                        ? "initial"
                                        : "center",
                                    px: 2.5,
                                }}
                                component={Link}
                                to={`/chat/${room.id}`}>
                                <Avatar
                                    sx={{
                                        minWidth: 0,
                                        mr: openSlidebar ? 3 : "auto",
                                        justifyContent: "center",
                                    }}
                                    src={room.receivers[0].avatar}
                                />
                                <ListItemText
                                    primary={room.receivers[0].name}
                                    sx={{ opacity: openSlidebar ? 1 : 0 }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 0,
                    backgroundColor: "var(--background-color)",
                }}>
                <DrawerHeader />
                <StyledChatPage>
                    <div className="ChatPage_content">
                        {chatRoomActive?.messages.map((message, index) => (
                            <ChatMessage
                                key={index}
                                ref={(element) =>
                                    (chatMessageRefs.current[index] = element)
                                }
                                message={message}
                                handleClickEditMessage={handleClickEditMessage}
                                handleClickDeleteMessage={
                                    handleClickDeleteMessage
                                }
                            />
                        ))}
                    </div>
                    <div className="ChatPage_footer">
                        <form onSubmit={sendMessage}>
                            <TextField
                                variant="outlined"
                                size="small"
                                placeholder="Nhập từ khóa tìm kiếm"
                                value={messageSend.content}
                                onChange={(e) => {
                                    setMessageSend((pre) => ({
                                        ...pre,
                                        content: e.target.value,
                                    }));
                                }}
                            />
                            <IconButton type="submit">
                                <Send />
                            </IconButton>
                        </form>
                    </div>
                    <Modal
                        title={modal.title}
                        description={modal.description}
                        open={modal.open}
                        handleClose={() => {
                            setModal((pre) => ({ ...pre, open: false }));
                            setMessageSend((pre) => ({
                                ...pre,
                                content: "",
                                type: EChatMessage.CHAT,
                            }));
                        }}
                        handleConfirm={handleConfirmDeleteMessage}
                    />
                </StyledChatPage>
            </Box>
        </Box>
    );
};

export default ChatPage;
