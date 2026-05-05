import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  price: number;
  location: string;
  type: 'House' | 'Apartment' | 'Plot' | 'Land' | 'Commercial';
  subType?: 'Residential' | 'Commercial' | 'Farm Land' | string;
  description: string;
  images: string[];
  area?: string;
  bedrooms?: number;
  bathrooms?: number;
  featured: boolean;
  createdAt: Date;
  fruitImage?: string;
  fruitInfo?: string;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    type: { 
      type: String, 
      required: true, 
      enum: ['House', 'Apartment', 'Plot', 'Land', 'Commercial'] 
    },
    subType: { type: String },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    area: { type: String },
    bedrooms: { type: Number },
    bathrooms: { type: Number },
    featured: { type: Boolean, default: false },
    fruitImage: { type: String },
    fruitInfo: { type: String },
  },
  { 
    timestamps: true,
    collection: 'items'
  }
);

if (mongoose.models.Property) {
  delete mongoose.models.Property;
}
export default model<IProperty>('Property', PropertySchema);
