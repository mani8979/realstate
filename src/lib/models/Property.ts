import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface IPropertyDetail {
  heading: string;
  content: string;
  sideHeading?: string;
  showArrow?: boolean;
  isPointed?: boolean;
}

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
  landPhotos?: string[];
  details?: IPropertyDetail[];
  threeDElement?: string;
  videoUrl?: string;
  mapUrl?: string;
  landBrochure?: string[];
  layoutImage?: string;
  plots?: { number: string; status: 'available' | 'booked' | 'sold'; x: number; y: number; width: number; height: number }[];
  status: 'active' | 'sold' | 'draft';
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    type: { 
      type: String, 
      required: true
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
    landPhotos: { type: [String] },
    details: [{
      heading: String,
      content: String,
      sideHeading: String,
      showArrow: { type: Boolean, default: false },
      isPointed: { type: Boolean, default: false },
    }],
    threeDElement: { type: String },
    videoUrl: { type: String },
    mapUrl: { type: String },
    landBrochure: { type: [String] },
    layoutImage: { type: String },
    plots: [{
      number: { type: String },
      status: { type: String, enum: ['available', 'booked', 'sold'], default: 'available' },
      x: { type: Number },
      y: { type: Number },
      width: { type: Number, default: 5 },
      height: { type: Number, default: 3 }
    }],
    status: { type: String, enum: ['active', 'sold', 'draft'], default: 'active' },
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
