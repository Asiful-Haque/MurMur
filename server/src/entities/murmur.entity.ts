import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity("murmurs")
export class Murmur {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: number;

    @Column("text")
    content: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.murmurs, { onDelete: "CASCADE" })
    user: User;
}
