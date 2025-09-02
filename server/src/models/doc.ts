// models/doc.ts
import { Schema, Types, model } from "mongoose";

export interface IDoc {
  title: string;
  content: string;
  summary?: string;
  tags?: string[];
  createdBy: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
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

const Doc = model<IDoc>("Doc", docSchema);
export default Doc;
