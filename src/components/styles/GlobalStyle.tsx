import { createGlobalStyle } from "styled-components";
import normalize from "styled-normalize";

const GlobalStyle = createGlobalStyle`
    ${normalize}
    :root {  
        --primary:#936dcb;
        --secondary: #f3917b;
        --tertiary: #e8d2a7;
        --primaryRGB: 147, 109, 203;
        --secondaryRGB: 243, 145, 123;
        --white: #f0f0f2;
        --black: #000000;
        --text-color: #653273;
        --header-background-color: #c5a7d9;
        --header-height: 80px;
        --container-background-color: #f0e9ff;
        --background-color: #f0f0f2;
    }
    
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }
    body {
        font-family: "Ysabeau Infant variable", "Toboto", sans-serif;
        font-weight: 600;
        font-size: 15px;
        background-color: var(--background-color);
    }

    button,
    input,
    select,
    textarea,
    [tabindex] {
        font-family: "Ysabeau Infant variable", "Roboto", sans-serif;
        font-size: 15px;
        font-weight: 600;
        outline: none;
        border: none;
        resize: none;
    }


    h1, h2 {
        color: var(--text-color);
        font-weight: bold;
        font-family: "Dancing Script Variable";
        margin: 0;
    }

    h1, h2, h3, h4, h5 {
        user-select: none;
    }

    a,
    button {
        font-family: "Ysabeau Infant variable", "Roboto", sans-serif;
        user-select: none;
        display: inline-block;
        text-align: center;
        text-decoration: none;
        &:hover {
            cursor: pointer;
        }
        
    }
    a:active {
        color: var(--text-color) ;
    }

    ul {
        margin: 0;
        padding: 0;
        list-style: none;
        line-height: 1.5;
    }

    img {
        pointer-events: none;
        user-select: none;
        -webkit-user-drag: none;
        -webkit-user-select: none;
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    @media (max-width: 600px) {
        
    }
    
`;

export default GlobalStyle;
