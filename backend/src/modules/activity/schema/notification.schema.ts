import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { BlogDocument } from '../../blog/schema/blog.schema';

export type NotificationDocument = HydratedDocument<Notification>;
export type TNotification = {
  likedBy: string;
  blog: any;
};

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, ref: 'User', type: MongooseSchema.Types.ObjectId })
  author: MongooseSchema.Types.ObjectId;
  @Prop({ required: true, ref: 'User', type: MongooseSchema.Types.ObjectId })
  likedBy: MongooseSchema.Types.ObjectId;
  @Prop({ required: true, ref: 'Blog', type: MongooseSchema.Types.ObjectId })
  blogId: MongooseSchema.Types.ObjectId;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
