import {BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, Raw} from "typeorm";
import {RequestWithId} from "../../middlewares/requestId";
import {getClientIp} from '@supercharge/request-ip';
import {Request} from "express";

const INTERVAL_TYPE = 'MINUTE';
const INTERVAL_UNITS = 5;
const INTERVAL_MAX = 5;

@Entity()
export default class AnonymousUserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: string;

    @Column()
    requestId!: string;

    @Column()
    ipAddress!: string;

    @CreateDateColumn()
    created!: Date;

    @DeleteDateColumn()
    deleted!: Date;

    static async canRequestAccess(request: Request): Promise<boolean> {
        const ipAddress = String(getClientIp(request));
        const count = await this.count({
            where: {
                ipAddress,
                created: Raw(alias => `${alias} >= NOW() - INTERVAL ${INTERVAL_UNITS} ${INTERVAL_TYPE}`),
            }
        })
        return count <= INTERVAL_MAX;
    }

    static async createFromRequest(request: RequestWithId): Promise<AnonymousUserEntity> {
        const entity = this.create();
        entity.requestId = request.id;
        entity.ipAddress = String(getClientIp(request));
        return await entity.save();
    }
}
