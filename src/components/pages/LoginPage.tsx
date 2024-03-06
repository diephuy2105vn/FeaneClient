import styled from "styled-components";
import Title from "../Title";
import { FormEvent, useEffect, useState } from "react";
import { Container, Button, TextField } from "@mui/material";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Card from "../Card";
import { loginUser } from "../../redux/userReducer";
import { AppDispatch, RootState } from "../../redux";

const Wrapper = styled(Container)`
    &.MuiContainer-root {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        min-height: calc(100vh - var(--header-height));
    }
`;

const StyledForm = styled.form`
    margin-top: 24px;
    padding: 4px;
    .Form-action {
        margin-top: 20px;
        .Form-button {
            margin-bottom: 16px;
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        }
        p {
            text-align: center;
        }
    }
`;

const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch: AppDispatch = useDispatch();
    const userState = useSelector((state: RootState) => state.user);
    const [user, setUser] = useState({
        username: {
            value: "",
            errorMessage: "",
        },
        password: {
            value: "",
        },
    });
    useEffect(() => {
        if (userState.user !== null) {
            navigate("/");
        }
    }, [userState.user]);

    const handleSubmitForm = (e: FormEvent) => {
        e.preventDefault();
        dispatch(
            loginUser({
                username: user.username.value,
                password: user.password.value,
            })
        );
    };

    return (
        <Wrapper>
            <Card
                column={3}
                columnTablet={2}
                columnPhone={1}
                color="primary"
                size="large">
                <Title textAlign="center">Login</Title>
                <StyledForm onSubmit={handleSubmitForm}>
                    <TextField
                        value={user.username.value}
                        label="Your username"
                        onChange={(e) => {
                            setUser((pre) => ({
                                ...pre,
                                username: {
                                    ...pre.username,
                                    value: e.target.value,
                                },
                            }));
                        }}
                        error={!!userState.error}
                        helperText={userState.error}
                        fullWidth={true}
                    />
                    <TextField
                        value={user.password.value}
                        type="password"
                        label="Your password"
                        onChange={(e) => {
                            setUser((pre) => ({
                                ...pre,
                                password: {
                                    ...pre.password,
                                    value: e.target.value,
                                },
                            }));
                        }}
                        fullWidth={true}
                    />
                    <div className="Form-action">
                        <div className="Form-button">
                            <Button variant="contained" type="submit">
                                Login
                            </Button>
                            <Button
                                variant="outlined"
                                component={Link}
                                to="/register">
                                Register
                            </Button>
                        </div>
                        <p>
                            Forgot your account?
                            <Link
                                style={{ marginLeft: "8px" }}
                                to="/forgetpass">
                                {" "}
                                Forgot password
                            </Link>
                        </p>
                    </div>
                </StyledForm>
            </Card>
        </Wrapper>
    );
};

export default LoginPage;
