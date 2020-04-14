import { Mutation, ArgsType, Field, Args, Query } from "type-graphql";
import Message from "../entities/Message";
import User from "../entities/User";
import Room from "../entities/Room";

@ArgsType()
class SendMessageInput {
  @Field()
  senderId: string;

  @Field()
  roomId: string;

  @Field()
  text: string;
}

export class MessageResolver {
  @Mutation(() => Message || null)
  async sendMessage(@Args() args: SendMessageInput) {
    // 유저 찾은다음에 Message 생성
    const { senderId, roomId, text } = args;
    try {
      const user = await User.findOne({ id: senderId });
      const room = await Room.findOne({ id: roomId });
      const message = await Message.create({ text, room, user }).save();
      return message;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
  @Query(() => [Message])
  async getMessages() {
    const messages = await Message.find({ relations: ["user", "room"] });
    return messages;
  }
}
