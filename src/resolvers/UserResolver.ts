import { Field, InputType, Resolver, Mutation, Arg, Query, ArgsType, Args, ID } from "type-graphql";
import User from "../entities/User";
import RoomUser from "../entities/RoomUser";

@InputType()
class CreateUserInput {
  @Field()
  username: string;
}

@ArgsType()
class EditUserInput {
  @Field(() => String, { nullable: true })
  username?: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async createUser(@Arg("options", () => CreateUserInput) options: CreateUserInput) {
    const user = await User.create(options).save();
    return user;
  }

  @Mutation(() => Boolean)
  async editUser(@Arg("id", () => ID) id: string, @Args() args: EditUserInput) {
    const { username } = args;
    if (username === undefined) return false;
    await User.update({ id }, { username });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("id", () => ID) id: string) {
    await RoomUser.delete({ userId: id });
    await User.delete({ id });

    return true;
  }

  @Query(() => [User])
  async getUsers() {
    const user = await User.find({ relations: ["messages"] });
    return user;
  }
}
