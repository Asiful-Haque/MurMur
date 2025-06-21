import { MurmursService } from "./murmur.service";
export declare class MurmursController {
    private murmursService;
    constructor(murmursService: MurmursService);
    create(userId: number, content: string): Promise<{
        result: {
            success: boolean;
        };
    }>;
    delete(id: number, userId: number): Promise<{
        result: {
            success: boolean;
        };
    }>;
    likeMurmur(murmurId: number, userId: number): Promise<{
        result: {
            success: boolean;
            message: string;
        };
    }>;
    getLikes(murmurId: number): Promise<{
        result: {
            count: any;
            users: any;
        };
    }>;
}
