'use client';
import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import StepOneForm from '../../project-info/StepOneForm';
import { useNetworkConfig } from '@/contexts/networkConfigContext';

export default function EditProjectInfo() {
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
            <StepOneForm />
        </div>
    );
}
