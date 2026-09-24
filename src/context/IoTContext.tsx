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
    isLoading: boolean;
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

    const [deviceStatus, setDeviceStatus] = useState(
        sampleDevices.reduce((acc, device) => {
            acc[device.id] = device.status;

            return acc;
        }, {} as Record<number, boolean>)
    );

    const toggleDevice = (
        id: number,
        value: boolean
    ) => {

        setDeviceStatus({
            ...deviceStatus,
            [id]: value,
        });

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
                isGatewayConnected: true,
                isLoading: false,
                error: null,
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