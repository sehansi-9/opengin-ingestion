// src/contexts/networkConfigContext.tsx
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
const CURRENT_CONFIG_ID_KEY = 'current-config-id';  // Track which config is being edited

type NetworkConfigContextType = {
    config: NetworkConfigInitialValues;
    currentConfigId: string | null;  // MongoDB _id of current config
    updateProjectInfo: (info: { readApi?: string; ingestionApi?: string; projectName?: string; description?: string }) => void;
    updateEntityTypes: (entityTypes: MajorType[]) => void;
    updateRelationships: (relationships: Relationship[]) => void;
    dataLoaded: boolean;
    resetLocalStorage: () => void;
    loadConfiguration: (id: string) => Promise<void>;  // Load config from MongoDB
    saveConfiguration: () => Promise<string>;  // Save to MongoDB
    setCurrentConfigId: (id: string | null) => void;  // Set which config is being edited
};

export const NetworkConfigContext = createContext<NetworkConfigContextType | null>(null);

export const NetworkConfigProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [config, setConfig] = useState<NetworkConfigInitialValues>(defaultConfig);
    const [currentConfigId, setCurrentConfigId] = useState<string | null>(null);
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
        if (currentConfigId) {
            localStorage.setItem(CURRENT_CONFIG_ID_KEY, currentConfigId);
        }
    };

    const readFromLocalStorage = () => {
        const loadedDataString = localStorage.getItem(LOCAL_STORAGE_KEY);
        const savedConfigId = localStorage.getItem(CURRENT_CONFIG_ID_KEY);

        if (savedConfigId) {
            setCurrentConfigId(savedConfigId);
        }

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
        localStorage.removeItem(CURRENT_CONFIG_ID_KEY);
        setConfig(defaultConfig);
        setCurrentConfigId(null);
    };

    // Load a configuration from MongoDB by ID
    const loadConfiguration = async (id: string) => {
        try {
            const response = await fetch(`/api/configurations/${id}`);
            const result = await response.json();

            if (result.success) {
                setConfig(result.data);
                setCurrentConfigId(id);
                saveDataToLocalStorage(result.data);
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error loading configuration:', error);
            throw error;
        }
    };

    // Save current configuration to MongoDB
    const saveConfiguration = async (): Promise<string> => {
        try {
            const url = currentConfigId
                ? `/api/configurations/${currentConfigId}`
                : '/api/configurations';

            const method = currentConfigId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(config),
            });

            const result = await response.json();

            if (result.success) {
                const savedId = result.data._id;
                setCurrentConfigId(savedId);
                localStorage.setItem(CURRENT_CONFIG_ID_KEY, savedId);
                return savedId;
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error saving configuration:', error);
            throw error;
        }
    };

    const contextValue = useMemo(
        () => ({
            config,
            currentConfigId,
            updateProjectInfo,
            updateEntityTypes,
            updateRelationships,
            dataLoaded,
            resetLocalStorage,
            loadConfiguration,
            saveConfiguration,
            setCurrentConfigId,
        }),
        [config, currentConfigId, dataLoaded, updateProjectInfo, updateEntityTypes, updateRelationships]
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