import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ReplyDocument = HydratedDocument<Reply>


@Schema({ timestamps: true })
export class Reply {
    @Prop({ required: true })
    content: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    author: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Comment', required: true })
    repliedTo: MongooseSchema.Types.ObjectId;
}

export const ReplySchema = SchemaFactory.createForClass(Reply);
