import {MigrationInterface, QueryRunner} from "typeorm";
import { User } from "../entity/User";

export class AddUser1610529720089 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        const userRepo = queryRunner.manager.getRepository(User);

        await userRepo.insert([{
            id: "00000000-0000-0000-0000-000000000000",
            createdAt: "2022-06-30 09:31:22.397149",
            updatedAt: "2022-06-30 09:31:22.397149",
            username: "user",
            passwordHash: "pass",
            isAdmin: false,
            email: "",
            notificationsOn: false
        }])
    }

    public async down(_queryRunner: QueryRunner): Promise<any> {
    }

}