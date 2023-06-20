import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class UserAvatar {
  @Prop({ required: true, unique: true })
  readonly userId: number;

  @Prop({ required: true })
  readonly hash: string;
}

export const AvatarSchema = SchemaFactory.createForClass(UserAvatar);
