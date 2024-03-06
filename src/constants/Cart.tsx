import { ProductType } from "./Product";
import { ShopType } from "./Shop";

export type CartDetailType = {
    id: number;
    product: ProductType;
    quantity: number;
    createdAt: string;
};

export type ShopCartType = {
    shop: ShopType;
    details: CartDetailType[];
};
