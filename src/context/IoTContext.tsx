import React, {
    createContext,
    useContext,
    useState,
} from 'react';

import {
    Device,
    SensorData,
    sampleDevices,
} from '../model/IoTModels';

type IoTContextType = {
    devices: typeof sampleDevices;
    sensors: SensorData;
    isGatewayConnected: boolean;
    updatingDeviceIds: number[];   // replaces isLoading
    error: string | null;
    toggleDevice: (id: number, value: boolean) => void;
};

const IoTContext = createContext<IoTContextType | undefined>(
    undefined
);

export function IoTProvider({
    children,
}: {
    children: React.ReactNode;
}) {

const [isGatewayConnected, setIsGatewayConnected] = useState(true);
const [updatingDeviceIds, setUpdatingDeviceIds] = useState<number[]>([]);
const [error, setError] = useState<string | null>(null);


    const [deviceStatus, setDeviceStatus] = useState(
        sampleDevices.reduce((acc, device) => {
            acc[device.id] = device.status;

            return acc;
        }, {} as Record<number, boolean>)
    );

    const toggleDevice = (
        id: number,
        value: boolean
    ) => {if (!isGatewayConnected) return;

    setUpdatingDeviceIds((prev) => [...prev, id]);

    setTimeout(() => {
        setDeviceStatus((prev) => ({
            ...prev,
            [id]: value,
        }));
        setUpdatingDeviceIds((prev) => prev.filter((deviceId) => deviceId !== id));
    }, 1000);
    };

    const updatedDevices = sampleDevices.map((device) => ({
        ...device,
        status: deviceStatus[device.id],
    }));

    const sensors: SensorData = {
        temperature: 100,
        humidity: 99,
        lightLevel: 1000,
    };

    return (
        <IoTContext.Provider
            value={{
                devices: updatedDevices,
                sensors,
                isGatewayConnected, // error was that it was been hardcoded to true
                updatingDeviceIds, // error was that it was been hardcoded to false
                error, // error was that it was been hardcoded to null
                toggleDevice,
            }}
        >
            {children}
        </IoTContext.Provider>
    );
}



export function useIoT() {

    const context = useContext(IoTContext);

    if (!context) {
        throw new Error(
            'useIoT must be used inside IoTProvider'
        );
    }

    return context;
}