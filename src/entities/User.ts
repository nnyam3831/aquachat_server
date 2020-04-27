import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm";
import { ObjectType, Field, ID } from "type-graphql";
import Message from "./Message";
import Room from "./Room";
import RoomUser from "./RoomUser";

@ObjectType()
@Entity()
class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ type: "text", unique: true })
  username: String;

  @Field()
  @Column({ type: "text" })
  email: String;

  @Field()
  @Column({ type: "text" })
  gender: String;

  @Field(() => String, {
    nullable: true,
  })
  @Column({
    type: "text",
    nullable: true,
    default:
      "http://icons.iconarchive.com/icons/papirus-team/papirus-status/256/avatar-default-icon.png",
  })
  avatar: String;

  @Field(() => [RoomUser])
  @OneToMany((type) => RoomUser, (roomUser) => roomUser.user)
  roomConnection: Promise<RoomUser[]>;

  @Field(() => [Message], { nullable: true })
  @OneToMany((type) => Message, (message) => message.user)
  messages: Message[];
}
export default User;
