import {BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, UpdateDateColumn} from "typeorm";
import {LoggerJson} from "../../utils/Logger";

@Entity()
export default class LogEntity extends BaseEntity {
    @PrimaryColumn()
    id!: string;

    @Column()
    level!: string;

    @Column({nullable: true, default: null})
    label!: string;

    @Column({nullable: true, default: null, type: 'text'})
    message!: string;

    @Column({type: 'simple-json'})
    raw!: LoggerJson;

    @Column({type: "datetime"})
    timestamp!: Date;

    @UpdateDateColumn()
    updated!: Date;

    @CreateDateColumn()
    created!: Date;

    @DeleteDateColumn()
    deleted!: Date;


    static async createFromLog(log: LoggerJson): Promise<LogEntity> {
        const entity = this.merge(new LogEntity(), {...log, raw: log});
        await entity.save();
        return entity;
    }
}
