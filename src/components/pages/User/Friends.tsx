import { useEffect, useRef, useState } from "react";
import {
    Box,
    TextField,
    IconButton,
    ClickAwayListener,
    Card as CardMui,
} from "@mui/material";
import Card, { CardFriend } from "../../Card";
import { Search } from "@mui/icons-material";
import styled from "styled-components";
import instance from "../../../axios";
import { FriendType } from "../../../constants/Friend";
import { Add } from "@mui/icons-material";
import { Link } from "react-router-dom";

const StyledCardSearchUser = styled(CardMui)`
    &.MuiCard-root {
        padding: 8px;
        width: 100%;
        display: flex;
        flex-direction: row;
        gap: 16px;
        box-shadow: none;
        border-radius: 0;
        + .MuiCard-root {
            border-top: 1px solid #ccc;
        }
        .card-user_thumbnail {
            padding: 4px;
            width: 40px;
            height: 40px;

            img {
                width: 100%;
                height: 100%;
                border-radius: 4px;
            }
        }
        .card-user_info {
            flex: 1;
            display: flex;
            align-items: center;
            h3 {
                color: var(--black);
            }
        }
        .card-user_menu {
            display: flex;
            align-items: center;
        }
    }
`;

const StyledBox = styled(Box)`
    display: grid;
    grid-template-columns: auto auto;
    column-gap: 8px;
    row-gap: 8px;
    @media (max-width: 600px) {
        grid-template-columns: auto;
    }
`;

const StyledSearch = styled.div`
    position: relative;
    margin-bottom: 16px;

    .MuiTextField-root {
        width: 100%;
        max-width: 400px;
        & .MuiInputBase-root {
            border-radius: 8px;
        }
    }
    .search-menu_result {
        background-color: #fff;
        width: 100%;
        max-width: 400px;
        position: absolute;
        overflow: hidden;
        z-index: 100;
        border: 1px solid #ccc;
        border-radius: 5px;
    }
`;

const Friends = () => {
    const [friends, setFriends] = useState<FriendType[]>([]);
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchResults, setSearchResults] = useState<FriendType[]>([]);

    const searchMenuRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        instance
            .get("/user/friends")
            .then((res) => setFriends(res.data))
            .catch((err) => console.log(err));
    }, []);

    const handleSearch = () => {
        if (searchValue.trim()) {
            instance
                .get(`/user/search?q=${searchValue}`)
                .then((res) => setSearchResults(res.data));
        }
    };

    return (
        <Card column={1}>
            <StyledSearch>
                <TextField
                    variant="outlined"
                    label="Search user"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <IconButton onClick={handleSearch}>
                                <Search />
                            </IconButton>
                        ),
                    }}
                />
                {searchResults.length > 0 && (
                    <ClickAwayListener
                        onClickAway={() => {
                            setSearchResults([]);
                        }}>
                        <div className="search-menu_result" ref={searchMenuRef}>
                            {searchResults.map((user, index) => (
                                <StyledCardSearchUser key={index}>
                                    <div className="card-user_thumbnail">
                                        <img src={user.avatar} />
                                    </div>
                                    <div className="card-user_info">
                                        <Link
                                            to={`/user?username=${user.username}`}>
                                            <h3>{user.name}</h3>
                                        </Link>
                                    </div>
                                    {!friends.some(
                                        (item) =>
                                            item.username === user.username
                                    ) && (
                                        <div className="card-user_button">
                                            <IconButton
                                                onClick={() => {
                                                    instance
                                                        .post(
                                                            `/user/friend?username=${user.username}`
                                                        )
                                                        .then(() =>
                                                            setFriends(
                                                                (pre) => [
                                                                    ...pre,
                                                                    user,
                                                                ]
                                                            )
                                                        );
                                                }}>
                                                <Add />
                                            </IconButton>
                                        </div>
                                    )}
                                </StyledCardSearchUser>
                            ))}
                        </div>
                    </ClickAwayListener>
                )}
            </StyledSearch>
            <StyledBox>
                {friends.map((friend, index) => (
                    <CardFriend key={index} friend={friend} />
                ))}
            </StyledBox>
        </Card>
    );
};

export default Friends;
