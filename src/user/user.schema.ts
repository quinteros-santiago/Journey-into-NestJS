import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  readonly userId: number;

  @Prop({ required: true, unique: true })
  readonly email: string;

  @Prop({ required: true })
  readonly firstName: string;

  @Prop()
  readonly lastName: string;

  @Prop({ required: true })
  readonly avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
