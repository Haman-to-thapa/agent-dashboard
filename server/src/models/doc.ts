import { Schema, model, Types } from "mongoose";

export interface IDoc {
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  createdBy: Types.ObjectId;
  versions?: { content: string; updatedAt: Date }[];
}

const docSchema = new Schema<IDoc>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    summary: { type: String },
    tags: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    versions: [
      {
        content: String,
        updatedAt: Date,
      },
    ],
  },
  { timestamps: true }
);

export default model<IDoc>("Doc", docSchema);
