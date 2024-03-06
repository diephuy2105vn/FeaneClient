import { UserType } from "../redux/userReducer";
import { EProduct } from "./Product";
export type ShopType = {
    id?: number;
    name: string;
    description: string;
    address: string;
    productTypes: EProduct[];
    owner: UserType;
    createdAt: string;
};
