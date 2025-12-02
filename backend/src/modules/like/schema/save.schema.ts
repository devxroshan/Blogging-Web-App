
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type SaveDocument = HydratedDocument<Save>


@Schema({ timestamps: true })
export class Save {
    @Prop({required: true,ref:'User', type: MongooseSchema.Types.ObjectId})
    author: MongooseSchema.Types.ObjectId;
    @Prop({required: true, ref: 'Blog' ,type:MongooseSchema.Types.ObjectId })
    blogId: MongooseSchema.Types.ObjectId
}

export const SaveSchema = SchemaFactory.createForClass(Save);
