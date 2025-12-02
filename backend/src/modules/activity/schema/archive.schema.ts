
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ArchiveDocument = HydratedDocument<Archive>


@Schema({ timestamps: true })
export class Archive {
    @Prop({required: true,ref:'User', type: MongooseSchema.Types.ObjectId})
    author: MongooseSchema.Types.ObjectId;
    @Prop({required: true, ref: 'Blog' ,type:MongooseSchema.Types.ObjectId })
    blogId: MongooseSchema.Types.ObjectId
}

export const ArchiveSchema = SchemaFactory.createForClass(Archive);
