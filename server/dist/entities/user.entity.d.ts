import { Murmur } from "./murmur.entity";
export declare class User {
    id: number;
    username: string;
    email: string;
    password: string;
    created_at: Date;
    murmurs: Murmur[];
}
