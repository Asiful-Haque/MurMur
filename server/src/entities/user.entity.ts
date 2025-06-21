import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { Murmur } from "./murmur.entity";


@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @CreateDateColumn()
    created_at: Date;

    @OneToMany(() => Murmur, (murmur) => murmur.user)
    murmurs: Murmur[];
}
