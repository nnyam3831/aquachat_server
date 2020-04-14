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
} from "typeorm";
import Message from "./Message";
import { ObjectType, Field, ID } from "type-graphql";
import User from "./User";

@ObjectType()
@Entity()
class Room extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field(() => [Message], { nullable: true })
  @OneToMany((type) => Message, (message) => message.room)
  messages: Message[];

  @Field(() => [User])
  @ManyToMany((type) => User, (user) => user.rooms)
  @JoinTable()
  participants: User[];

  @CreateDateColumn() createdAt: string;
  @UpdateDateColumn() updatedAt: string;
}

export default Room;
