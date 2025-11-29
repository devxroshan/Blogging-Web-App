import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument , Types} from 'mongoose';

export type ProfileDocument = HydratedDocument<Profile>;

@Schema({ timestamps: true })
export class Profile {
    @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
    userId: Types.ObjectId;
    @Prop({ type: String, default: '' })
    bio: string;
    @Prop({ type: String, default: '' })
    avatarUrl: string
    @Prop({ type: String, default: '' })
    website: string;
    @Prop({ type: String, default: '' })
    fullname: string;
}

export const ProfileSchema = SchemaFactory.createForClass(Profile);
