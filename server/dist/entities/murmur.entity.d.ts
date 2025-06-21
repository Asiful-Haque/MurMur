import { User } from "./user.entity";
export declare class Murmur {
    id: number;
    user_id: number;
    content: string;
    createdAt: Date;
    user: User;
}
