'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReviewForm from '../../review/ReviewForm';
import { useNetworkConfig } from '@/contexts/networkConfigContext';

export default function EditReview() {
    const params = useParams();
    const id = params.id as string;
    const { loadConfiguration, setCurrentConfigId } = useNetworkConfig();

    useEffect(() => {
        if (id && id !== 'new') {
            loadConfiguration(id);
            setCurrentConfigId(id);
        }
    }, [id, setCurrentConfigId]);

    return (
        <div>
            <ReviewForm />
        </div>
    );
}
