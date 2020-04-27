import {
  Field,
  InputType,
  Resolver,
  Mutation,
  Arg,
  Query,
  ArgsType,
  Args,
  ID,
  Ctx,
} from "type-graphql";
import User from "../entities/User";
import RoomUser from "../entities/RoomUser";

@ArgsType()
class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  gender: string;
}

@ArgsType()
class EditUserInput {
  @Field(() => String, { nullable: true })
  username?: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => String, { nullable: true })
  gender?: string;

  @Field(() => String, { nullable: true })
  avatar?: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async createUser(@Args() args: CreateUserInput) {
    const user = await User.create(args).save();
    return user;
  }

  @Mutation(() => Boolean)
  async editUser(@Arg("id", () => ID) id: string, @Args() args: EditUserInput) {
    const { username, avatar, gender, email } = args;
    await User.update({ id }, { avatar });
    return true;
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg("userId", () => String) userId: string) {
    await RoomUser.delete({ userId });
    await User.delete({ id: userId });

    return true;
  }

  @Mutation(() => Boolean)
  async confirmUser(@Arg("username", () => String) username: string) {
    try {
      const user = await User.findOne({ username });
      if (!user) throw Error();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  @Query(() => [User])
  async getUsers() {
    const user = await User.find({ relations: ["messages"] });
    return user;
  }

  @Query(() => User)
  async getMyProfile(@Arg("username") username: string) {
    const user = await User.findOne({ username });
    return user;
  }
}
