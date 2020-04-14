import { Resolver, Mutation, InputType, Field, Arg, Query, Args, ArgsType, ID } from "type-graphql";
import Room from "../entities/Room";
import User from "../entities/User";
import { createQueryBuilder } from "typeorm";

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
  async createRoom(@Arg("options", () => CreateRoomInput) options: CreateRoomInput) {
    const master = await User.find({ username: options.master });
    console.log(master);
    if (master === null || master === undefined) return null;
    const room = await Room.create({ participants: master }).save();
    return room;
  }

  @Mutation(() => Room)
  async addRoomUser(@Args() args: AddRoomUserInput) {
    const { chatRoomId, targetId } = args;
    // const room = await Room.findOne({ where: { id: chatRoomId }, relations: ["participants"] });
    const room = await Room.findOne({ where: { id: chatRoomId }, relations: ["participants"] });
    const newUser = await User.findOne({ where: { id: targetId }, relations: ["rooms"] });
    let participants = room?.participants;

    if (newUser) {
      participants = participants?.concat(newUser);
      console.log(newUser);
    }

    await Room.update({ id: chatRoomId }, { participants });
    return room;
  }
  @Query(() => [Room])
  async getRooms() {
    const room = await Room.find({ relations: ["participants", "messages"] });
    return room;
  }
}
