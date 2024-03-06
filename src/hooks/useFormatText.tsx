import { useCallback } from "react";

const useTextFormatting = () => {
    const capitalizeTextFormat = useCallback((str: string) => {
        return str
            .toLowerCase()
            .split(" ")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }, []);
    const convertTimeFormat = useCallback((str: string) => {
        const date = new Date(str);
        const now = new Date();
        if (date.toDateString() === now.toDateString()) {
            const formattedDate = date.toLocaleString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
            });
            return formattedDate;
        }
        const formattedDate = date.toLocaleString("vi-VN", {
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
        return formattedDate;
    }, []);

    const convertDateFormat = useCallback((str: string) => {
        const date = new Date(str);
        const formattedDate = date.toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
        return formattedDate;
    }, []);

    const convertPriceFormat = useCallback((str: string) => {
        return str.toLocaleString() + " ₫";
    }, []);
    return {
        capitalizeTextFormat,
        convertTimeFormat,
        convertDateFormat,
        convertPriceFormat,
    };
};

export default useTextFormatting;
