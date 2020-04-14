import {
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Entity,
  Column,
  ManyToMany,
} from "typeorm";
import Room from "./Room";
import { ObjectType, Field, ID } from "type-graphql";
import User from "./User";

@ObjectType()
@Entity()
class Message extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => Room)
  @ManyToOne((type) => Room, (room) => room.messages, { nullable: false, onDelete: "CASCADE" })
  room: Room;

  @Field(() => User)
  @ManyToOne((type) => User, (user) => user.messages, { nullable: false, onDelete: "CASCADE" })
  user: User;

  @Field()
  @Column({ type: "text" })
  text: String;

  @CreateDateColumn() createdAt: string;
  @UpdateDateColumn() updatedAt: string;
}

export default Message;
