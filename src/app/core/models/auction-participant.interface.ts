import { Product } from "./product.interface";
import { UserInfo } from "./user-info.interface";

export interface AuctionParticipant {
  id: number;
  user: UserInfo;
  product: Product;
  bidAmount: number;
}
