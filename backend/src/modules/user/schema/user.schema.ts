
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument , Types} from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    username: string;
    @Prop({ required: true, unique: true })
    email: string;
    @Prop({ required: true})
    password: string;
    @Prop({ type: Boolean, default: false })
    isVerified: boolean;
    @Prop({ type: Types.ObjectId, ref: 'Profile' , default: null})
    profileId: Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
