'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import StepTwoForm from './StepTwoForm';
import { useNetworkConfig } from '@/contexts/networkConfigContext';

export default function EditKindInfo() {
    const params = useParams();
    const id = params.id as string;
    const { loadConfiguration, currentConfigId, config } = useNetworkConfig();

    useEffect(() => {
        if (id && id !== 'new' && (currentConfigId !== id || !config.projectName)) {
            loadConfiguration(id);
        }
    }, [id, currentConfigId, config.projectName, loadConfiguration]);

    return (
        <div>
            <StepTwoForm />
        </div>
    );
}
