import {
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Entity,
  ManyToMany,
  JoinColumn,
  JoinTable,
  Column,
} from "typeorm";
import Message from "./Message";
import { ObjectType, Field, ID } from "type-graphql";
import User from "./User";
import RoomUser from "./RoomUser";

@ObjectType()
@Entity()
class Room extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => [Message], { nullable: true })
  @OneToMany((type) => Message, (message) => message.room)
  messages: Message[];

  @Field(() => [RoomUser])
  @OneToMany((type) => RoomUser, (roomUser) => roomUser.room)
  userConnection: Promise<RoomUser[]>;

  @CreateDateColumn() createdAt: string;
  @UpdateDateColumn() updatedAt: string;
}

export default Room;
