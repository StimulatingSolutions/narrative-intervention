import { User, Message, Chat, School } from './models';
import { Users } from './collections/users';
import { Messages } from './collections/messages';
import { Chats } from './collections/chats';
import { Schools } from './collections/schools';

Meteor.publish('users', function(): Mongo.Cursor<User> {
  if (!this.userId) {
    return;
  }

  return Users.collection.find({}, {
    fields: {
      profile: 1
    }
  });
});

Meteor.publish('messages', function(chatId: string): Mongo.Cursor<Message> {
  if (!this.userId || !chatId) {
    return;
  }

  return Messages.collection.find({
    chatId
  }, {
    sort: { createdAt: -1 }
  });
});

Meteor["publishComposite"]('chats', function(): PublishCompositeConfig<Chat> {
  if (!this.userId) {
    return;
  }

  return {
    find: () => {
      return Chats.collection.find({ memberIds: this.userId });
    },

    children: [
      <PublishCompositeConfig1<Chat, Message>> {
        find: (chat) => {
          return Messages.collection.find({ chatId: chat._id }, {
            sort: { createdAt: -1 },
            limit: 1
          });
        }
      },
      <PublishCompositeConfig1<Chat, User>> {
        find: (chat) => {
          return Users.collection.find({
            _id: { $in: chat.memberIds }
          }, {
            fields: { profile: 1 }
          });
        }
      }
    ]
  };
});

Meteor.publish('schools', function(): Mongo.Cursor<School> {
  if (!this.userId) {
    return;
  }

  return Schools.collection.find({}, {
    fields: { name: 1}
  });
});
