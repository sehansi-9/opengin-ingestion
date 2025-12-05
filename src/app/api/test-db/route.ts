import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';

export async function GET() {
    try {
        const db = await connectToDatabase();
        return NextResponse.json({
            success: true,
            message: 'Connected to MongoDB successfully!',
            database: db.connection.name,
        });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to connect to MongoDB',
        }, { status: 500 });
    }
}
