import { ProductType } from "./Product";
import { ShopType } from "./Shop";

export type OrderDetailType = {
    product: ProductType;
    quantity: number;
    totalPrice?: number;
};

export type OrderType = {
    id?: string;
    name: string;
    address: string;
    phoneNumber: string;
    shop: ShopType;
    orderDetails: OrderDetailType[];
    createdAt: string;
    totalPrice?: number;
    status?: "CONFIRMED" | "UNCONFIRM";
};
