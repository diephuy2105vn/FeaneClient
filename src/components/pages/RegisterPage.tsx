import styled from "styled-components";
import Title from "../Title";
import { useRef, useState } from "react";
import Card from "../Card";
import {
    Container,
    Button,
    TextField,
    Step,
    Stepper,
    StepLabel,
    List,
    ListItem,
    ListSubheader,
    FormControlLabel,
    Checkbox,
    Box,
} from "@mui/material";
import validator from "validator";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "@mui/icons-material";
import Slider from "react-slick";
import instance from "../../axios";
import { AxiosError, AxiosResponse } from "axios";
import { EMessage, MessageType } from "../../constants/Message";
const Wrapper = styled(Container)`
    &.MuiContainer-root {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        min-height: calc(100vh - var(--header-height));
    }
`;

const StyledForm = styled.div`
    width: 100%;
    padding: 4px;
    .Slider-item {
        padding: 2px;
    }
    .MuiFormControlLabel-root {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 4px 0;
        padding: 0px;
    }
    .MuiFormHelperText-root {
        line-height: 1.2;
        margin-top: 2px;
    }
    .MuiBox-root {
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
    }
`;

const StyledStepper = styled(Stepper)`
    width: 100%;
    margin: 24px 0 16px;
`;

const StyledFormAction = styled.div`
    width: 100%;
    .Form-button {
        margin-bottom: 16px;
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
        gap: 8px;
    }
    p {
        text-align: center;
    }
`;

const StyledList = styled(List)`
    &.MuiList-root {
        width: 100%;
        position: relative;
        overflow: auto;
        padding: 0;
        max-height: 136px;
    }
    .MuiListSubheader-root {
        padding: 0%;
        line-height: 28px;
    }
    .MuiListItem-root {
        padding: 0;
        font-size: 14px;
    }
`;
const terms = [
    {
        title: "Introduction & Products",
        description:
            "Welcome to Feane, where products comply with our regulations.",
    },
    {
        title: "Pricing & Return Policy",
        description:
            "Prices may change. Products can be returned within 14 days.",
    },
    {
        title: "Privacy",
        description:
            "Feane is committed to protecting your personal information.",
    },
];
const steps = ["Create account", "Customer infor", "Confirm terms"];
const settings = {
    infinite: false,
    arrows: false,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipe: false,
    fullWidth: true,
};

const RegisterPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const navigate = useNavigate();
    const [user, setUser] = useState({
        username: {
            value: "",
            isValid: false,
            errorMessage: "",
        },
        password: {
            value: "",
            isValid: false,
            errorMessage: "",
        },
        confirmPassword: {
            value: "",
            isValid: false,
            errorMessage: "",
        },
        name: {
            value: "",
            isValid: false,
            errorMessage: "",
        },
        phoneNumber: {
            value: "",
            isValid: false,
            errorMessage: "",
        },
        address: {
            value: "",
            isValid: false,
            errorMessage: "",
        },
        isAgreeTerm: false,
    });
    const handlePreventKeyDownTab = (e: React.KeyboardEvent) => {
        if (e.key === "Tab") {
            e.preventDefault();
        }
    };
    const sliderRef = useRef<Slider | null>(null);
    const disabledNext = (): boolean => {
        return activeStep === 0
            ? !(
                  user.username.isValid &&
                  user.password.isValid &&
                  user.confirmPassword.isValid
              )
            : activeStep === 1
            ? !(
                  user.name.isValid &&
                  user.phoneNumber.isValid &&
                  user.address.isValid
              )
            : !user.isAgreeTerm;
    };

    const handleCheckUsername = (username: string) => {
        instance
            .post<MessageType>("/auth/checkuser", username)
            .then((res: AxiosResponse<MessageType>) => {
                if (res.data.status === EMessage.SUCCESS) {
                    return setActiveStep((pre) => {
                        sliderRef.current?.slickGoTo(++pre);
                        return pre;
                    });
                }
                return setUser((pre) => ({
                    ...pre,
                    username: {
                        ...pre.username,
                        isValid: false,
                        errorMessage: res.data.message,
                    },
                }));
            })
            .catch((err: AxiosError<MessageType>) => {
                return setUser((pre) => ({
                    ...pre,
                    username: {
                        ...pre.username,
                        isValid: false,
                        errorMessage: err.response?.data.message || "Error",
                    },
                }));
            });
    };

    const handleSubmitForm = () => {
        if (user.isAgreeTerm) {
            instance
                .post<MessageType>("/auth/signup", {
                    username: user.username.value,
                    password: user.password.value,
                    name: user.name.value,
                    address: user.address.value,
                    phoneNumber: user.phoneNumber.value,
                })
                .then(
                    (res: AxiosResponse<MessageType>) =>
                        res.data.status === EMessage.SUCCESS &&
                        navigate("/login")
                )
                .catch((err: AxiosError<MessageType>) =>
                    console.log(err.response?.data.status)
                );
        }
    };

    return (
        <Wrapper>
            <Card
                column={3}
                columnTablet={2}
                columnPhone={1}
                color="primary"
                size="large">
                <Title textAlign="center">Register</Title>
                <StyledForm onSubmit={handleSubmitForm}>
                    <StyledStepper alternativeLabel activeStep={activeStep}>
                        {steps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </StyledStepper>
                    <Slider ref={sliderRef} {...settings}>
                        <div className="Slider-item">
                            <TextField
                                value={user.username.value}
                                label="Your username"
                                size="small"
                                onChange={(e) => {
                                    setUser((pre) => ({
                                        ...pre,
                                        username: {
                                            ...pre.username,
                                            value: e.target.value,
                                        },
                                    }));
                                }}
                                onBlur={() => {
                                    const validated = validator.isAlphanumeric(
                                        user.username.value
                                    );
                                    setUser((pre) => ({
                                        ...pre,
                                        username: {
                                            ...pre.username,
                                            isValid: validated,
                                            errorMessage: validated
                                                ? ""
                                                : "Username is not valid",
                                        },
                                    }));
                                }}
                                error={!!user.username.errorMessage}
                                helperText={user.username.errorMessage}
                                fullWidth={true}
                            />
                            <TextField
                                value={user.password.value}
                                type="password"
                                onChange={(e) => {
                                    setUser((pre) => ({
                                        ...pre,
                                        password: {
                                            ...pre.password,
                                            value: e.target.value,
                                        },
                                    }));
                                }}
                                onBlur={() => {
                                    const validated =
                                        validator.isStrongPassword(
                                            user.password.value,
                                            {
                                                minLength: 8,
                                                minNumbers: 1,
                                                minLowercase: 0,
                                                minUppercase: 0,
                                                minSymbols: 0,
                                            }
                                        );
                                    setUser((pre) => ({
                                        ...pre,
                                        password: {
                                            ...pre.password,
                                            isValid: validated,
                                            errorMessage: validated
                                                ? ""
                                                : "Password is not strong",
                                        },
                                    }));
                                }}
                                error={!!user.password.errorMessage}
                                helperText={user.password.errorMessage}
                                size="small"
                                label="Your password"
                                fullWidth={true}
                            />
                            <TextField
                                value={user.confirmPassword.value}
                                type="password"
                                size="small"
                                label="Confirm password"
                                onChange={(e) => {
                                    setUser((pre) => ({
                                        ...pre,
                                        confirmPassword: {
                                            ...pre.confirmPassword,
                                            value: e.target.value,
                                        },
                                    }));
                                }}
                                onBlur={() => {
                                    const validated = validator.equals(
                                        user.confirmPassword.value,
                                        user.password.value
                                    );
                                    setUser((pre) => ({
                                        ...pre,
                                        confirmPassword: {
                                            ...pre.confirmPassword,
                                            isValid: validated,
                                            errorMessage: validated
                                                ? ""
                                                : "Confirm password is not correct",
                                        },
                                    }));
                                }}
                                error={!!user.confirmPassword.errorMessage}
                                helperText={user.confirmPassword.errorMessage}
                                onKeyDown={handlePreventKeyDownTab}
                                fullWidth={true}
                            />
                        </div>
                        <div className="Slider-item">
                            <TextField
                                value={user.name.value}
                                label="Your name"
                                size="small"
                                onChange={(e) => {
                                    setUser((pre) => ({
                                        ...pre,
                                        name: {
                                            ...pre.name,
                                            value: e.target.value,
                                        },
                                    }));
                                }}
                                onBlur={() => {
                                    setUser((pre) => ({
                                        ...pre,
                                        name: {
                                            ...pre.name,
                                            isValid: !!validator.trim(
                                                pre.name.value
                                            ),
                                            errorMessage: validator.trim(
                                                pre.name.value
                                            )
                                                ? ""
                                                : "Name is not empty",
                                        },
                                    }));
                                }}
                                error={!!user.name.errorMessage}
                                helperText={user.name.errorMessage}
                                fullWidth={true}
                            />
                            <TextField
                                value={user.phoneNumber.value}
                                type="number"
                                onChange={(e) => {
                                    setUser((pre) => ({
                                        ...pre,
                                        phoneNumber: {
                                            ...pre.phoneNumber,
                                            value: e.target.value,
                                        },
                                    }));
                                }}
                                onBlur={() => {
                                    setUser((pre) => ({
                                        ...pre,
                                        phoneNumber: {
                                            ...pre.phoneNumber,
                                            isValid: validator.isMobilePhone(
                                                pre.phoneNumber.value
                                            ),
                                            errorMessage:
                                                validator.isMobilePhone(
                                                    pre.phoneNumber.value
                                                )
                                                    ? ""
                                                    : "Phone number is not valid",
                                        },
                                    }));
                                }}
                                error={!!user.phoneNumber.errorMessage}
                                helperText={user.phoneNumber.errorMessage}
                                size="small"
                                label="Your phone number"
                                fullWidth={true}
                            />
                            <TextField
                                value={user.address.value}
                                type="textarea"
                                size="small"
                                label="Your address"
                                onChange={(e) => {
                                    setUser((pre) => ({
                                        ...pre,
                                        address: {
                                            ...pre.address,
                                            value: e.target.value,
                                        },
                                    }));
                                }}
                                multiline
                                rows={2}
                                onBlur={() => {
                                    setUser((pre) => ({
                                        ...pre,
                                        address: {
                                            ...pre.address,
                                            isValid: !!validator.trim(
                                                pre.address.value
                                            ),
                                            errorMessage: validator.trim(
                                                pre.address.value
                                            )
                                                ? ""
                                                : "Address is not empty",
                                        },
                                    }));
                                }}
                                error={!!user.address.errorMessage}
                                helperText={user.address.errorMessage}
                                onKeyDown={handlePreventKeyDownTab}
                                fullWidth={true}
                            />
                        </div>
                        <div className="Slider-item">
                            <Box>
                                <StyledList>
                                    {terms.map((term, index) => (
                                        <div key={index}>
                                            <ListSubheader>
                                                {`${index + 1}. ${term.title}`}
                                            </ListSubheader>
                                            <ListItem>
                                                {term.description}
                                            </ListItem>
                                        </div>
                                    ))}
                                </StyledList>
                            </Box>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={user.isAgreeTerm}
                                        onChange={(e) =>
                                            setUser((pre) => ({
                                                ...pre,
                                                isAgreeTerm: e.target.checked,
                                            }))
                                        }
                                    />
                                }
                                label="I agree with the shop's terms"
                            />
                        </div>
                    </Slider>
                    <StyledFormAction>
                        <div className="Form-button">
                            <Button
                                type="submit"
                                variant={
                                    activeStep === steps.length - 1
                                        ? "contained"
                                        : "outlined"
                                }
                                endIcon={
                                    activeStep !== steps.length - 1 && (
                                        <ArrowRight />
                                    )
                                }
                                disabled={disabledNext()}
                                onClick={() => {
                                    activeStep === 0
                                        ? handleCheckUsername(
                                              user.username.value
                                          )
                                        : activeStep === steps.length - 1
                                        ? handleSubmitForm()
                                        : setActiveStep((pre) => {
                                              sliderRef.current?.slickGoTo(
                                                  ++pre
                                              );
                                              return pre;
                                          });
                                }}>
                                {activeStep === steps.length - 1
                                    ? "Register"
                                    : "Next"}
                            </Button>

                            {activeStep > 0 && (
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setActiveStep((pre) => {
                                            sliderRef.current?.slickGoTo(--pre);
                                            return pre;
                                        });
                                    }}>
                                    Back
                                </Button>
                            )}
                        </div>

                        <p>
                            Bạn đã có tài khoản?
                            <Link to="/login">Login</Link>
                        </p>
                    </StyledFormAction>
                </StyledForm>
            </Card>
        </Wrapper>
    );
};

export default RegisterPage;
