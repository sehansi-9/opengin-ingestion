'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import StepThreeForm from '../../relationship-info/StepThreeForm';
import { useNetworkConfig } from '@/contexts/networkConfigContext';

export default function EditRelationshipInfo() {
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
            <StepThreeForm />
        </div>
    );
}
