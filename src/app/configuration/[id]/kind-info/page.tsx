'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import StepTwoForm from '../../kind-info/StepTwoForm';
import { useNetworkConfig } from '@/contexts/networkConfigContext';

export default function EditKindInfo() {
    const params = useParams();
    const id = params.id as string;
    const { loadConfiguration } = useNetworkConfig();

    useEffect(() => {
        if (id && id !== 'new') {
            loadConfiguration(id);
        }
    }, [id]);

    return (
        <div>
            <StepTwoForm />
        </div>
    );
}
