import { Mutation, Arg, Resolver, Query } from "type-graphql";
import User from "../entities/User";

@Resolver()
export class SearchResolver {
  @Query(() => User || null)
  async searchUser(@Arg("username") username: string) {
    const user = await User.findOne({
      username,
    });
    if (!user) return null;
    return user;
  }
}
