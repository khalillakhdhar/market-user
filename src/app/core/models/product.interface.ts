import { UserInfo } from "./user-info.interface";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  photo: string;
  initialPrice: number;
  highestBidPrice: number;
  highestBidder?: UserInfo;
  auction:any
}
