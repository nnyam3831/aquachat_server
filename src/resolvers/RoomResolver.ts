import { Resolver, Mutation, InputType, Field, Arg, Query, Args, ArgsType, ID } from "type-graphql";
import Room from "../entities/Room";
import User from "../entities/User";
import { createQueryBuilder } from "typeorm";
import RoomUser from "../entities/RoomUser";
import Message from "../entities/Message";

@InputType()
class CreateRoomInput {
  @Field()
  master: string;
}

@ArgsType()
class AddRoomUserInput {
  @Field(() => ID)
  targetId: string;

  @Field(() => ID)
  chatRoomId: string;
}
@Resolver()
export class RoomResolver {
  @Mutation(() => Room)
  async createRoom() {
    // add Room User 같이
    return Room.create().save();
  }

  @Mutation(() => Boolean)
  async deleteRoom(@Arg("roomId") roomId: string) {
    await RoomUser.delete({ roomId });
    await Room.delete({ id: roomId });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteAllRooms() {
    await RoomUser.clear();
    await Room.clear();
    await Message.clear();
    return true;
  }

  @Query(() => [Room])
  async getRooms(@Arg("username") username: string) {
    const rooms = await Room.find({
      where: {
        userConnection: {
          user: {
            username: username,
          },
        },
      },
      relations: ["messages"],
      order: {
        createdAt: "DESC",
      },
    });
    return rooms;
  }
  @Query(() => Room)
  async getRoom(@Arg("roomId") roomId: string) {
    const room = await Room.findOne({
      where: {
        id: roomId,
      },
      relations: ["messages", "messages.user"],
    });
    return room;
  }

  @Query(() => [Room])
  async getAllRooms() {
    return Room.find();
  }
}
