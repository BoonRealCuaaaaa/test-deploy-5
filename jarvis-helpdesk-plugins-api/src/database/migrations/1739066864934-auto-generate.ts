import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoGenerate1739066864934 implements MigrationInterface {
  name = 'AutoGenerate1739066864934';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Response_Templates" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "description" text NOT NULL, "template" text NOT NULL, "isActive" boolean NOT NULL DEFAULT false, "assistantId" uuid, CONSTRAINT "PK_40310ba0217955a61e1ea123e21" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "Rules" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" text NOT NULL, "isEnable" boolean NOT NULL DEFAULT false, "aiAssistantId" uuid, CONSTRAINT "PK_6b3823a21cc6c08840ab175f02c" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."Getting_Started_Tasks_name_enum" AS ENUM('Integration', 'Rule')`);
    await queryRunner.query(
      `CREATE TABLE "Getting_Started_Tasks" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" text NOT NULL, "link" text NOT NULL, "name" "public"."Getting_Started_Tasks_name_enum" NOT NULL, CONSTRAINT "PK_7641305a98152b06df33714c2bf" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "Team_Getting_Started_Tasks" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "teamId" uuid, "gettingStartedTaskId" uuid, CONSTRAINT "PK_4ebc10a8a021c995c89c51359f0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."Integration_Platforms_type_enum" AS ENUM('Zendesk', 'Pancake', 'Zohodesk', 'Tiktokshop')`
    );
    await queryRunner.query(
      `CREATE TABLE "Integration_Platforms" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" "public"."Integration_Platforms_type_enum" NOT NULL, "domain" text NOT NULL, "isEnable" boolean NOT NULL, "teamId" uuid, CONSTRAINT "PK_bce9477a4e230d244dd2b3a79a2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`CREATE TYPE "public"."Team_Roles_role_enum" AS ENUM('admin', 'member')`);
    await queryRunner.query(
      `CREATE TABLE "Team_Roles" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" "public"."Team_Roles_role_enum" NOT NULL, "userId" uuid, "teamId" uuid, CONSTRAINT "UQ_7d14d3108487c751d51d592a8b7" UNIQUE ("userId", "teamId"), CONSTRAINT "PK_0f2955a93c998efe8acdeece4de" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "Teams" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "stackId" text NOT NULL, "displayName" text NOT NULL, "activateAssistantId" uuid, CONSTRAINT "UQ_f8c5c5e27b46c3f290aff4515e4" UNIQUE ("stackId"), CONSTRAINT "REL_d1acdb34d0485021d0e1131091" UNIQUE ("activateAssistantId"), CONSTRAINT "PK_e32c9037aa9e0f1546e98290b4f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "AI_Assistants" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "jarvisBotId" uuid, "teamId" uuid, CONSTRAINT "PK_6b6aaa013c33945b97748861fec" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "Assistant_Configs" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "values" jsonb NOT NULL, CONSTRAINT "PK_63db5a9f0fbf6084324a80d4aea" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "User_Assistant_Configs" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "metadata" jsonb NOT NULL, "userId" uuid, "aiAssistantId" uuid, "assistantConfigId" uuid, CONSTRAINT "REL_a9621455df67594dc423419606" UNIQUE ("assistantConfigId"), CONSTRAINT "PK_9f839c3b4f5d68315d3c7634067" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "Users" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "createdBy" character varying, "updatedBy" character varying, "id" uuid NOT NULL DEFAULT uuid_generate_v4(), "stackId" uuid NOT NULL, CONSTRAINT "PK_16d4f7d636df336db11d87413e3" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "Response_Templates" ADD CONSTRAINT "FK_64883d38c4129fb12407cae09cb" FOREIGN KEY ("assistantId") REFERENCES "AI_Assistants"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Rules" ADD CONSTRAINT "FK_e91202f58602792e7ab8a28e6fd" FOREIGN KEY ("aiAssistantId") REFERENCES "AI_Assistants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Team_Getting_Started_Tasks" ADD CONSTRAINT "FK_6d5a7d81d74de73da13ae76af96" FOREIGN KEY ("teamId") REFERENCES "Teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Team_Getting_Started_Tasks" ADD CONSTRAINT "FK_70cbac380161ac10047fd663e4a" FOREIGN KEY ("gettingStartedTaskId") REFERENCES "Getting_Started_Tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Integration_Platforms" ADD CONSTRAINT "FK_22c487857c62682d7c99b8b6b16" FOREIGN KEY ("teamId") REFERENCES "Teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Team_Roles" ADD CONSTRAINT "FK_9a1210b060dec78a057ba440453" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Team_Roles" ADD CONSTRAINT "FK_50874249481cd6db0bb08281ceb" FOREIGN KEY ("teamId") REFERENCES "Teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Teams" ADD CONSTRAINT "FK_d1acdb34d0485021d0e1131091c" FOREIGN KEY ("activateAssistantId") REFERENCES "AI_Assistants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "AI_Assistants" ADD CONSTRAINT "FK_37aa5d3727e2d9e7c9c937cfb54" FOREIGN KEY ("teamId") REFERENCES "Teams"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "User_Assistant_Configs" ADD CONSTRAINT "FK_ac94e8cec7e888972784a41fa94" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "User_Assistant_Configs" ADD CONSTRAINT "FK_a160dee6107edbacf366fb6f833" FOREIGN KEY ("aiAssistantId") REFERENCES "AI_Assistants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "User_Assistant_Configs" ADD CONSTRAINT "FK_a9621455df67594dc4234196065" FOREIGN KEY ("assistantConfigId") REFERENCES "Assistant_Configs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "User_Assistant_Configs" DROP CONSTRAINT "FK_a9621455df67594dc4234196065"`);
    await queryRunner.query(`ALTER TABLE "User_Assistant_Configs" DROP CONSTRAINT "FK_a160dee6107edbacf366fb6f833"`);
    await queryRunner.query(`ALTER TABLE "User_Assistant_Configs" DROP CONSTRAINT "FK_ac94e8cec7e888972784a41fa94"`);
    await queryRunner.query(`ALTER TABLE "AI_Assistants" DROP CONSTRAINT "FK_37aa5d3727e2d9e7c9c937cfb54"`);
    await queryRunner.query(`ALTER TABLE "Teams" DROP CONSTRAINT "FK_d1acdb34d0485021d0e1131091c"`);
    await queryRunner.query(`ALTER TABLE "Team_Roles" DROP CONSTRAINT "FK_50874249481cd6db0bb08281ceb"`);
    await queryRunner.query(`ALTER TABLE "Team_Roles" DROP CONSTRAINT "FK_9a1210b060dec78a057ba440453"`);
    await queryRunner.query(`ALTER TABLE "Integration_Platforms" DROP CONSTRAINT "FK_22c487857c62682d7c99b8b6b16"`);
    await queryRunner.query(
      `ALTER TABLE "Team_Getting_Started_Tasks" DROP CONSTRAINT "FK_70cbac380161ac10047fd663e4a"`
    );
    await queryRunner.query(
      `ALTER TABLE "Team_Getting_Started_Tasks" DROP CONSTRAINT "FK_6d5a7d81d74de73da13ae76af96"`
    );
    await queryRunner.query(`ALTER TABLE "Rules" DROP CONSTRAINT "FK_e91202f58602792e7ab8a28e6fd"`);
    await queryRunner.query(`ALTER TABLE "Response_Templates" DROP CONSTRAINT "FK_64883d38c4129fb12407cae09cb"`);
    await queryRunner.query(`DROP TABLE "Users"`);
    await queryRunner.query(`DROP TABLE "User_Assistant_Configs"`);
    await queryRunner.query(`DROP TABLE "Assistant_Configs"`);
    await queryRunner.query(`DROP TABLE "AI_Assistants"`);
    await queryRunner.query(`DROP TABLE "Teams"`);
    await queryRunner.query(`DROP TABLE "Team_Roles"`);
    await queryRunner.query(`DROP TYPE "public"."Team_Roles_role_enum"`);
    await queryRunner.query(`DROP TABLE "Integration_Platforms"`);
    await queryRunner.query(`DROP TYPE "public"."Integration_Platforms_type_enum"`);
    await queryRunner.query(`DROP TABLE "Team_Getting_Started_Tasks"`);
    await queryRunner.query(`DROP TABLE "Getting_Started_Tasks"`);
    await queryRunner.query(`DROP TYPE "public"."Getting_Started_Tasks_name_enum"`);
    await queryRunner.query(`DROP TABLE "Rules"`);
    await queryRunner.query(`DROP TABLE "Response_Templates"`);
  }
}
