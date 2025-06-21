import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Murmur } from "./murmur.entity";

@Entity()
export class Like {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column()
    murmur_id: number;

    @CreateDateColumn()
    created_at: Date;
}
