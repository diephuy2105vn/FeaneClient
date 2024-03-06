import React from "react";
import styled from "styled-components";

type TitleProps = React.PropsWithChildren<{
    size?: string;
    color?: string;
    textAlign?: string;
    fontFamily?: "Dancing Script Variable" | "normal";
}> &
    React.HTMLAttributes<HTMLButtonElement>;

type StyledTitleProps = Omit<TitleProps, "textAlign"> & {
    $textAlign?: string;
    $fontFamily?: "Dancing Script Variable" | "normal";
};

const StyledTitle = styled.h1<StyledTitleProps>`
    font-size: ${(props) =>
        props.size === "large"
            ? "64px"
            : props.size === "small"
            ? "40px"
            : "52px"};
    color: ${(props) =>
        props.color === "primary"
            ? "var(--primary)"
            : props.color === "secondary"
            ? "var(--secondary)"
            : props.color === "black"
            ? "black"
            : "var(--text-color)"};
    text-align: ${(props) => props.$textAlign || "left"};
    font-family: ${(props) =>
        (props.$fontFamily === "normal" && "Ysabeau Infant variable") ||
        "Dancing Script Variable"};
    font-weight: 500;
    margin-bottom: 8px;
    @media (max-width: 900px) {
        font-size: ${(props) =>
            props.size === "large"
                ? "52px"
                : props.size === "small"
                ? "36px"
                : "40px"};
    }
    @media (max-width: 600px) {
        font-size: ${(props) =>
            props.size === "large"
                ? "40px"
                : props.size === "small"
                ? "32px"
                : "36px"};
    }
`;

const Title = React.memo(
    ({
        size = "medium",
        color,
        children,
        fontFamily = "Dancing Script Variable",
        textAlign,
        ...props
    }: TitleProps) => {
        return (
            <StyledTitle
                size={size}
                color={color}
                $textAlign={textAlign}
                $fontFamily={fontFamily}
                {...props}>
                {children}
            </StyledTitle>
        );
    }
);

export default Title;
