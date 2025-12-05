// src/app/api/configurations/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import NetworkConfigModel from '@/models/NetworkConfig';
import mongoose from 'mongoose';
/**
 * GET /api/configurations/[id]
 * Retrieves a single configuration by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid configuration ID' },
                { status: 400 }
            );
        }
        await connectToDatabase();
        // Find configuration by ID
        const configuration = await NetworkConfigModel.findById(id).lean();
        if (!configuration) {
            return NextResponse.json(
                { success: false, error: 'Configuration not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({
            success: true,
            data: configuration,
        });
    } catch (error) {
        console.error('Error fetching configuration:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch configuration' },
            { status: 500 }
        );
    }
}
/**
 * PUT /api/configurations/[id]
 * Updates a configuration
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid configuration ID' },
                { status: 400 }
            );
        }
        await connectToDatabase();
        // Find and update the configuration
        const updatedConfig = await NetworkConfigModel.findByIdAndUpdate(
            id,
            body,
            {
                new: true,  // Return the updated document
                runValidators: true,  // Run schema validators
            }
        ).lean();
        if (!updatedConfig) {
            return NextResponse.json(
                { success: false, error: 'Configuration not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({
            success: true,
            data: updatedConfig,
        });
    } catch (error) {
        console.error('Error updating configuration:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update configuration' },
            { status: 500 }
        );
    }
}
/**
 * DELETE /api/configurations/[id]
 * Deletes a configuration
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                { success: false, error: 'Invalid configuration ID' },
                { status: 400 }
            );
        }
        await connectToDatabase();
        // Find and delete the configuration
        const deletedConfig = await NetworkConfigModel.findByIdAndDelete(id).lean();
        if (!deletedConfig) {
            return NextResponse.json(
                { success: false, error: 'Configuration not found' },
                { status: 404 }
            );
        }
        return NextResponse.json({
            success: true,
            message: 'Configuration deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting configuration:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete configuration' },
            { status: 500 }
        );
    }
}