import { ObjectType, Field, ID } from "type-graphql";
import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import User from "./User";
import Room from "./Room";

@ObjectType()
@Entity()
class RoomUser extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  userId?: string;

  @Column()
  roomId: string;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.roomConnection, { nullable: true })
  @JoinColumn({ name: "userId" })
  user: Promise<User>;

  @Field(() => Room)
  @ManyToOne(() => Room, (room) => room.userConnection, { nullable: true })
  @JoinColumn({ name: "roomId" })
  room: Promise<Room>;
}

export default RoomUser;
