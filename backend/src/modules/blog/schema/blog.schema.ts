import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument , Types, ObjectId} from 'mongoose';

export type BlogDocument = HydratedDocument<Blog>;

export enum EBlogCategory {
    Tech = 'tech',
    Science = 'science',
    Film = 'film',
    SpaceAndTech = 'spaceandtech',
    Astronomy = 'astronomy',
    Astrophysics = 'astrophysics',
    QuantumPhysics = 'quantumphysics',
    Physics = 'physics',
    Electronics = 'electronics',
    Clothes = 'clothes',
    Bussines = 'bussines'
}

@Schema({ timestamps: true })
export class Blog {
    @Prop({ required: true, ref:'User', type: Types.ObjectId})
    author: Types.ObjectId;
    @Prop({ required: true })
    title: string;
    @Prop({ required: true })
    blog: string;
    @Prop({ required: true, enum: EBlogCategory})
    category: string;
    @Prop({default: ''})
    blogImg: string;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
