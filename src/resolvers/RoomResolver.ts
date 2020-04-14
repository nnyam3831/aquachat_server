import { Resolver, Mutation, InputType, Field, Arg, Query, Args, ArgsType, ID } from "type-graphql";
import Room from "../entities/Room";
import User from "../entities/User";
import { createQueryBuilder } from "typeorm";
import RoomUser from "../entities/RoomUser";

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
    return Room.create().save();
  }

  @Mutation(() => Boolean)
  async deleteRoom(@Arg("roomId") roomId: string) {
    await RoomUser.delete({ roomId });
    await Room.delete({ id: roomId });
    return true;
  }
  @Query(() => [Room])
  async getRooms() {
    const room = await Room.find({ relations: ["messages"] });
    return room;
  }
}
