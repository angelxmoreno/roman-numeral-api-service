import {
    BaseEntity,
    BeforeInsert,
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    PrimaryGeneratedColumn
} from "typeorm";
import bcrypt from 'bcryptjs';
import {v4 as uuidV4} from "uuid";
import {Exclude} from "class-transformer";

@Entity()
export default class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column()
    name!: string

    @Column({unique: true})
    email!: string

    @Column({select: false})
    @Exclude()
    password!: string

    @Column({unique: true})
    apiKey!: string

    @Column({type: "boolean", default: true})
    isDevelopment!: string

    @Column({type: "simple-array"})
    allowedDomains!: string[]

    @CreateDateColumn()
    created!: Date;

    @DeleteDateColumn()
    deleted!: Date;

    @BeforeInsert()
    beforeInsert() {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
        this.apiKey = uuidV4().replace('-', '').toLowerCase();
        this.allowedDomains = [];
    }
}