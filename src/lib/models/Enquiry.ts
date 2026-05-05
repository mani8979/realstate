import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  phone: string;
  message: string;
  propertyTitle?: string;
  propertyId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    propertyTitle: { type: String },
    propertyId: { type: Schema.Types.ObjectId, ref: 'Property' },
  },
  { timestamps: true }
);

export default models.Enquiry || model<IEnquiry>('Enquiry', EnquirySchema);
