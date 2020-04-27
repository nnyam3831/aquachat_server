import {
  BaseEntity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Entity,
  Column,
  ManyToMany,
  JoinColumn,
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
  @JoinColumn()
  room: Room;

  @Field(() => User)
  @ManyToOne((type) => User, (user) => user.messages, { nullable: false, onDelete: "CASCADE" })
  user: User;

  @Field()
  @Column({ type: "text" })
  text: String;

  @Field()
  @Column({ type: "boolean" })
  isNotif: Boolean;

  @CreateDateColumn() createdAt: string;
  @UpdateDateColumn() updatedAt: string;
}

export default Message;
