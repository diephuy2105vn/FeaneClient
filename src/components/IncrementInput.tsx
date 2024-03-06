import React from "react";
import { Button } from "@mui/material";
import styled from "styled-components";

const Wrapper = styled.div<{ $size: "small" | "medium" | "large" }>`
    display: inline-flex;
    align-items: center;
    height: ${(props) =>
        props.$size === "small"
            ? "20px"
            : props.$size === "medium"
            ? "25px"
            : "30px"};
    border: 1px solid #ccc;
    border-radius: 3px;
    .MuiButton-root {
        color: black;
        min-width: ${(props) =>
            props.$size === "small"
                ? "20px"
                : props.$size === "medium"
                ? "25px"
                : "30px"};
        height: 100%;
    }
    input {
        border-left: 1px solid #ccc;
        border-right: 1px solid #ccc;
        height: 100%;
        font-size: ${(props) =>
            props.$size === "small"
                ? "12px"
                : props.$size === "medium"
                ? "14px"
                : "16px"};
        max-width: ${(props) =>
            props.$size === "small"
                ? "40px"
                : props.$size === "medium"
                ? "45px"
                : "50px"};
        text-align: center;
    }
`;

type InputProps = {
    value?: number;
    setValue?: React.Dispatch<React.SetStateAction<number>>;
    minValue?: number;
    maxValue?: number;
    size?: "small" | "medium" | "large";
    handleIncrement?: () => void;
    handleDecrement?: () => void;
    handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const IncrementInput = ({
    value = 1,
    setValue,
    minValue = 1,
    maxValue = 99,
    size = "medium",
    handleIncrement,
    handleDecrement,
    handleChange,
}: InputProps) => {
    const handleIncrementValue = () => {
        if (value < maxValue) {
            setValue &&
                setValue((prevValue) =>
                    prevValue < maxValue ? prevValue + 1 : maxValue
                );
            handleIncrement && handleIncrement();
        }
        return;
    };

    const handleDecrementValue = () => {
        if (value > minValue) {
            setValue &&
                setValue((prevValue) =>
                    prevValue > minValue ? prevValue - 1 : minValue
                );
            handleDecrement && handleDecrement();
        }
        return;
    };
    const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value);
        setValue &&
            setValue(
                value > maxValue
                    ? maxValue
                    : value > minValue
                    ? value
                    : minValue
            );
        handleChange && handleChange(e);
    };

    return (
        <Wrapper $size={size}>
            <Button onClick={handleDecrementValue} size="small">
                -
            </Button>
            <input value={value} onChange={handleChangeValue} type="number" />
            <Button onClick={handleIncrementValue} size="small">
                +
            </Button>
        </Wrapper>
    );
};

export default IncrementInput;
