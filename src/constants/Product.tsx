import { ShopType } from "./Shop";

export enum EProduct {
    CLOTHES = "CLOTHES",
    SHOES = "SHOES",
    ACCESSORIES = "ACCESSORIES",
    COMPUTER = "COMPUTER",
    PHONE = "PHONE",
    DEVICE = "DEVICE",
    OTHER = "OTHER",
}

export type ProductType = {
    id?: string;
    name: string;
    description: string;
    price: string;
    quantity: string;
    type: EProduct | null;
    sold?: number;
    note: string;
    images: string[];
    shop?: ShopType | null;
};
