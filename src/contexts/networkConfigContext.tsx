'use client';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    NetworkConfigInitialValues,
    networkConfigInitialValuesSchema,
    MajorType,
    Relationship,
} from '@/schemas';

// Default empty configuration
const defaultConfig: NetworkConfigInitialValues = {
    readApi: '',
    ingestionApi: '',
    projectName: '',
    description: '',
    entityTypes: [],
    relationships: [],
};

const LOCAL_STORAGE_KEY = 'network-config-data';

type NetworkConfigContextType = {
    config: NetworkConfigInitialValues;
    updateProjectInfo: (info: { readApi?: string; ingestionApi?: string; projectName?: string; description?: string }) => void;
    updateEntityTypes: (entityTypes: MajorType[]) => void;
    updateRelationships: (relationships: Relationship[]) => void;
    dataLoaded: boolean;
    resetLocalStorage: () => void;
};

export const NetworkConfigContext = createContext<NetworkConfigContextType | null>(null);

export const NetworkConfigProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [config, setConfig] = useState<NetworkConfigInitialValues>(defaultConfig);
    const [dataLoaded, setDataLoaded] = useState(false);

    // Load from localStorage on mount
    useEffect(() => {
        readFromLocalStorage();
        setDataLoaded(true);
    }, []);

    // Save to localStorage whenever config changes
    useEffect(() => {
        if (dataLoaded) {
            saveDataToLocalStorage(config);
        }
    }, [config, dataLoaded]);

    const updateProjectInfo = useCallback(
        (info: { readApi?: string; ingestionApi?: string; projectName?: string; description?: string }) => {
            setConfig({ ...config, ...info });
        },
        [config]
    );

    const updateEntityTypes = useCallback(
        (entityTypes: MajorType[]) => {
            setConfig({ ...config, entityTypes });
        },
        [config]
    );

    const updateRelationships = useCallback(
        (relationships: Relationship[]) => {
            setConfig({ ...config, relationships });
        },
        [config]
    );

    const saveDataToLocalStorage = (currentConfig: NetworkConfigInitialValues) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentConfig));
    };

    const readFromLocalStorage = () => {
        const loadedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!loadedDataString) return setConfig(defaultConfig);

        const validated = networkConfigInitialValuesSchema.safeParse(
            JSON.parse(loadedDataString)
        );

        if (validated.success) {
            setConfig(validated.data);
        } else {
            console.warn('Invalid data in localStorage, resetting to default');
            setConfig(defaultConfig);
        }
    };

    const resetLocalStorage = () => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        setConfig(defaultConfig);
    };

    const contextValue = useMemo(
        () => ({
            config,
            updateProjectInfo,
            updateEntityTypes,
            updateRelationships,
            dataLoaded,
            resetLocalStorage,
        }),
        [config, dataLoaded, updateProjectInfo, updateEntityTypes, updateRelationships]
    );

    return (
        <NetworkConfigContext.Provider value={contextValue}>
            {children}
        </NetworkConfigContext.Provider>
    );
};

export function useNetworkConfig() {
    const context = useContext(NetworkConfigContext);
    if (context === null) {
        throw new Error(
            'useNetworkConfig must be used within a NetworkConfigProvider'
        );
    }
    return context;
}
