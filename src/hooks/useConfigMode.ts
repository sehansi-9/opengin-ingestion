import { usePathname } from 'next/navigation';

export function useConfigMode() {
    const pathname = usePathname();

    // Extract ID from URL if in edit mode
    const match = pathname.match(/\/configuration\/([^\/]+)\//);
    const configId = match ? match[1] : null;
    const isEditMode = configId && configId !== 'new';

    return {
        isEditMode,
        configId: isEditMode ? configId : null,
    };
}

export function getNextRoute(currentPath: string, nextStep: 'kind-info' | 'relationship-info' | 'review') {
    const match = currentPath.match(/\/configuration\/([^\/]+)\//);
    const id = match ? match[1] : 'new';

    return `/configuration/${id}/${nextStep}`;
}

export function getPrevRoute(currentPath: string, prevStep: 'project-info' | 'kind-info' | 'relationship-info') {
    const match = currentPath.match(/\/configuration\/([^\/]+)\//);
    const id = match ? match[1] : 'new';

    return `/configuration/${id}/${prevStep}`;
}
