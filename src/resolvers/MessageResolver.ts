import {
  Mutation,
  ArgsType,
  Field,
  Args,
  Query,
  Subscription,
  Root,
  ID,
  PubSub,
  PubSubEngine,
  ObjectType,
  Arg,
} from "type-graphql";
import Message from "../entities/Message";
import User from "../entities/User";
import Room from "../entities/Room";

@ArgsType()
class SendMessageInput {
  @Field()
  sender: string;

  @Field()
  roomId: string;

  @Field()
  text: string;

  @Field(() => Boolean)
  isNotif: boolean;
}
@ArgsType()
class NewMessageArgs {
  @Field()
  id: string;
}

@ObjectType()
class NewMessage {
  @Field(() => ID)
  sender: string;

  @Field({ nullable: true })
  message?: Message;

  @Field(() => Date)
  date: Date;

  @Field(() => ID)
  roomId: string;

  @Field(() => Boolean)
  isNotif: boolean;
}
export class MessageResolver {
  @Subscription({
    topics: ["NEW_MESSAGES"],
    filter: ({ payload, args }) => {
      console.log(payload);
      return payload.roomId === args.id;
    },
  })
  newMessage(
    @Root() { sender, message, isNotif, roomId },
    @Args() args: NewMessageArgs
  ): NewMessage {
    console.log(sender, message, isNotif, roomId);
    console.log(args, "홍");
    console.log(roomId, "항");
    return { sender, roomId, message, date: new Date(), isNotif };
  }
  @Mutation(() => Boolean)
  async sendMessage(@Args() args: SendMessageInput, @PubSub() pubSub: PubSubEngine) {
    // 유저 찾은다음에 Message 생성

    const { sender, roomId, text, isNotif } = args;

    try {
      const user = await User.findOne({ username: sender });
      const room = await Room.findOne({ id: roomId });
      const message = await Message.create({ text, room, user, isNotif }).save();
      console.log(roomId);
      const payload = { message: message, sender: sender, isNotif: isNotif, roomId: roomId };
      await pubSub.publish("NEW_MESSAGES", payload);

      if (!(room && user && message)) throw Error();
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
  @Query(() => [Message])
  async getMessages(@Arg("roomId") roomId: string) {
    const messages = await Message.find({
      where: {
        room: {
          id: roomId,
        },
      },
      relations: ["user", "room"],
      order: {
        createdAt: "ASC",
      },
    });
    return messages;
  }
}
