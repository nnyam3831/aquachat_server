import { Resolver, Mutation, ArgsType, ID, Field, Args, Query } from "type-graphql";
import RoomUser from "../../entities/RoomUser";

@ArgsType()
class AddRoomUserInput {
  @Field(() => ID)
  roomId: string;

  @Field(() => ID)
  userId: string;
}

@Resolver()
export class RoomUserResolver {
  @Mutation(() => RoomUser)
  async addRoomUser(@Args() args: AddRoomUserInput) {
    const { roomId, userId } = args;
    const isExist = await RoomUser.findOne({ roomId, userId });
    if (isExist) {
      return isExist;
    }
    const roomUser = await RoomUser.create({ roomId, userId }).save();
    return roomUser;
  }
  @Query(() => [RoomUser])
  async getRoomUser() {
    return RoomUser.find({ relations: ["user", "room"] });
  }
}
