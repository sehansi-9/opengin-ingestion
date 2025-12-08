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

const defaultConfig: NetworkConfigInitialValues = {
    readApi: '',
    ingestionApi: '',
    projectName: '',
    description: '',
    majorTypes: [],
    relationships: [],
};

const LOCAL_STORAGE_KEY = 'network-config-data';
const CURRENT_CONFIG_ID_KEY = 'current-config-id';  // Track which config is being edited

type NetworkConfigContextType = {
    config: NetworkConfigInitialValues;
    currentConfigId: string | null;  // MongoDB _id of current config
    updateMajorTypes: (majorTypes: MajorType[]) => void;
    updateRelationships: (relationships: Relationship[]) => void;
    updateProjectInfo: (info: { projectName: string; description: string; readApi: string; ingestionApi: string }) => void;
    dataLoaded: boolean;
    resetLocalStorage: () => void;
    loadConfiguration: (id: string) => Promise<void>;  // Load config from MongoDB
    saveConfiguration: (overrideConfig?: Partial<NetworkConfigInitialValues>) => Promise<string>;  // Save to MongoDB
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

    const updateMajorTypes = useCallback(
        (majorTypes: MajorType[]) => {
            setConfig((prev) => ({ ...prev, majorTypes }));
        },
        []
    );

    const updateRelationships = useCallback(
        (relationships: Relationship[]) => {
            setConfig((prev) => ({ ...prev, relationships }));
        },
        []
    );

    const updateProjectInfo = useCallback(
        (info: { projectName: string; description: string; readApi: string; ingestionApi: string }) => {
            setConfig((prev) => ({ ...prev, ...info }));
        },
        []
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

    const resetLocalStorage = useCallback(() => {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        localStorage.removeItem(CURRENT_CONFIG_ID_KEY);
        setConfig(defaultConfig);
        setCurrentConfigId(null);
    }, []);

    // Load a configuration from MongoDB by ID
    const loadConfiguration = useCallback(async (id: string) => {
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
    }, []);

    // Save current configuration to MongoDB
    const saveConfiguration = useCallback(async (overrideConfig?: Partial<NetworkConfigInitialValues>): Promise<string> => {
        try {
            const configPayload = { ...config, ...(overrideConfig || {}) };
            const url = currentConfigId
                ? `/api/configurations/${currentConfigId}`
                : '/api/configurations';

            const method = currentConfigId ? 'PUT' : 'POST';

            // Strip _id and system fields from the body to avoid Mongoose errors
            const { _id, createdAt, updatedAt, ...configToSave } = configPayload as any;

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(configToSave),
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
    }, [config, currentConfigId]);

    const contextValue = useMemo(
        () => ({
            config,
            currentConfigId,
            updateMajorTypes,
            updateRelationships,
            updateProjectInfo,
            dataLoaded,
            resetLocalStorage,
            loadConfiguration,
            saveConfiguration,
            setCurrentConfigId,
        }),
        [config, currentConfigId, dataLoaded, updateMajorTypes, updateRelationships, updateProjectInfo, resetLocalStorage, loadConfiguration, saveConfiguration, setCurrentConfigId]
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