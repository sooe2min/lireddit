import { Migration } from '@mikro-orm/migrations';

export class Migration20210612110916 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamptz(0) not null default \'NOW()\', "updated_at" timestamptz(0) not null default \'NOW()\', "email" text not null, "username" text not null, "password" text not null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('alter table "user" add constraint "user_username_unique" unique ("username");');

    this.addSql('create table "post" ("id" serial primary key, "created_at" timestamptz(0) not null default \'NOW()\', "updated_at" timestamptz(0) not null default \'NOW()\', "title" text not null);');
  }

}
