import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import NetworkConfigModel from '@/models/NetworkConfig';
/**
 * GET /api/configurations
 * Retrieves all network configurations from the database
 */
export async function GET(request: NextRequest) {
    try {
        // Connect to MongoDB
        await connectToDatabase();
        // Find all configurations, sorted by most recent first
        const configurations = await NetworkConfigModel.find({})
            .sort({ updatedAt: -1 })  // Sort by updatedAt descending
            .lean();  // Convert to plain JavaScript objects
        // Return the configurations
        return NextResponse.json({
            success: true,
            data: configurations,
        });
    } catch (error) {
        console.error('Error fetching configurations:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch configurations',
            },
            { status: 500 }
        );
    }
}
/**
 * POST /api/configurations
 * Creates a new network configuration
 */
export async function POST(request: NextRequest) {
    try {
        // Parse the request body
        const body = await request.json();
        // Connect to MongoDB
        await connectToDatabase();
        // Create a new configuration document
        const newConfig = await NetworkConfigModel.create(body);
        // Return the created configuration
        return NextResponse.json({
            success: true,
            data: newConfig,
        }, { status: 201 });
    } catch (error) {
        console.error('Error creating configuration:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to create configuration',
            },
            { status: 500 }
        );
    }
}