import { Field, InputType, Resolver, Mutation, Arg, Query } from "type-graphql";
import User from "../entities/User";

@InputType()
class CreateUserInput {
  @Field()
  username: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async createUser(@Arg("options", () => CreateUserInput) options: CreateUserInput) {
    const user = await User.create(options).save();
    return user;
  }
  @Query(() => [User])
  getUsers() {
    return User.find();
  }
}
