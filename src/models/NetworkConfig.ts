// src/models/NetworkConfig.ts
import mongoose, { Schema, Model } from 'mongoose';
import { NetworkConfig } from '@/schemas';

/**
 * TypeScript interface for the MongoDB document
 * This extends your existing NetworkConfig type with MongoDB-specific fields
 */
export interface INetworkConfigDocument extends NetworkConfig {
    _id: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * Mongoose Schema Definition
 * This defines the structure of documents in the MongoDB collection
 */
const NetworkConfigSchema = new Schema<INetworkConfigDocument>(
    {
        // Step 1: Project Information
        projectName: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: false,
        },
        readApi: {
            type: String,
            required: true,
            trim: true,
        },
        ingestionApi: {
            type: String,
            required: true,
            trim: true,
        },

        // Step 2: Major Types
        majorTypes: {
            type: [
                {
                    id: { type: String, required: true },
                    name: { type: String, required: true },
                    minorTypes: {
                        type: [
                            {
                                id: { type: String, required: true },
                                name: { type: String, required: true },
                            },
                        ],
                        default: [],
                    },
                },
            ],
            default: [],
        },

        // Step 3: Relationships
        relationships: {
            type: [
                {
                    id: { type: String, required: true },
                    name: { type: String, required: true },
                    connections: {
                        type: [
                            {
                                id: { type: String, required: true },
                                from: { type: String, required: true },
                                to: { type: String, required: true },
                                direction: {
                                    type: String,
                                    enum: ['INGOING', 'OUTGOING', 'BOTH'],
                                    required: true,
                                },
                                requiresTime: { type: Boolean, required: true },
                            },
                        ],
                        default: [],
                    },
                },
            ],
            default: [],
        },
    },
    {
        // Automatically add createdAt and updatedAt timestamps
        timestamps: true,
    }
);

/**
 * Create or retrieve the Mongoose model
 * This prevents model recompilation during hot-reload in development
 */
const NetworkConfigModel: Model<INetworkConfigDocument> =
    mongoose.models.NetworkConfig ||
    mongoose.model<INetworkConfigDocument>('NetworkConfig', NetworkConfigSchema);

export default NetworkConfigModel;