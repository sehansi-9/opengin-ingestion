'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import ReviewForm from './ReviewForm';
import { useNetworkConfig } from '@/contexts/networkConfigContext';

export default function EditReview() {
    const params = useParams();
    const id = params.id as string;
    const { loadConfiguration, setCurrentConfigId, currentConfigId, config } = useNetworkConfig();

    useEffect(() => {
        if (id && id !== 'new' && (currentConfigId !== id || !config.projectName)) {
            loadConfiguration(id);
            setCurrentConfigId(id);
        }
    }, [id, currentConfigId, config.projectName, loadConfiguration, setCurrentConfigId]);

    return (
        <div>
            <ReviewForm />
        </div>
    );
}
