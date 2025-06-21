import { DataSource } from 'typeorm';
export declare class MurmursService {
    private dataSource;
    constructor(dataSource: DataSource);
    createMurmur(userId: number, content: string): Promise<{
        success: boolean;
    }>;
    deleteMurmur(userId: number, murmurId: number): Promise<{
        success: boolean;
    }>;
    likeMurmur(userId: number, murmurId: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getLikesForMurmur(murmurId: number): Promise<{
        count: any;
        users: any;
    }>;
}
