import React, {
    createContext,
    useContext,
    useState,
    useEffect, // it is needed to fetch devices from the service when the app starts
} from 'react';

import {
    getSensorData,
    getDevices,
    updateDeviceStatus,
} from '../services/IoTService'; // import the service functions so the IoTContext can call them instead of generating data itself

import {
    Device,
    SensorData,
} from '../model/IoTModels';



type IoTContextType = {
    devices: Device[];
    sensors: SensorData;
    isSensorsLoading: boolean; // For Activity 9
    isDevicesLoading: boolean; // For Activity 10: it will track the inital dedvice fetch and separate from the updatingDeviceIds state that tracks individual device updates
    isGatewayConnected: boolean;
    updatingDeviceIds: number[];   // replaces isLoading
    error: string | null;
    toggleDevice: (id: number, value: boolean) => void;
    refreshSensors: () => void; // function to refresh sensor data
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


const [devices, setDevices] = useState<Device[]>([]);
    const [isDevicesLoading, setIsDevicesLoading] = useState(false);

    // Activity 10: fetch the device list once, when the Provider first mounts.
    // Empty [] dependency array = run only on initial mount, like a page load
    // hitting a real backend for the first time.
    useEffect(() => {
        setIsDevicesLoading(true);

        getDevices()
            .then((data) => setDevices(data)) // success: store what the service returned
            .catch((err) => setError(err.message)) // failure: store the error message instead of crashing
            .finally(() => setIsDevicesLoading(false)); // either way: loading is done
    }, []);

    const toggleDevice = async (
        // Activity 10: function is now "async" because it uses "await" inside —
        // it used to be a plain function using setTimeout, now it awaits the service call
        id: number,
        value: boolean
    ) => {
        if (!isGatewayConnected) return;

        setUpdatingDeviceIds((prev) => [...prev, id]);

        try {
            // Activity 10: replaced the old inline setTimeout with a real
            // await call to the service — the "network delay" now lives
            // inside IoTService.ts, not duplicated here
            await updateDeviceStatus(id, value);

            // Activity 10: update the devices array directly (no more
            // separate deviceStatus map + reduce — devices is now the
            // single source of truth)
            setDevices((prev) =>
                prev.map((device) =>
                    device.id === id ? { ...device, status: value } : device
                )
            );
        } catch (err) {
            // Activity 10: new — if the service throws (simulated failure),
            // catch it here and store a message instead of letting it crash the app
            setError(err instanceof Error ? err.message : 'Unable to update device.');
        } finally {
            setUpdatingDeviceIds((prev) => prev.filter((deviceId) => deviceId !== id));
        }
    };


  const [sensors, setSensors] = useState<SensorData>({
        temperature: 28,
        humidity: 65,
        lightLevel: 720,
    });

    const [isSensorsLoading, setIsSensorsLoading] = useState(false);

    const refreshSensors = async () => {
        // Activity 10: now "async" — awaits the service instead of using setTimeout directly
        setIsSensorsLoading(true);

        try {
            // Activity 10: replaced the inline Math.random() calculations with a call to the service — random-number 
        const data = await getSensorData();
            setSensors(data);
        } catch (err) {
            // Activity 10: new — handle a simulated sensor-fetch failure gracefully
            setError(err instanceof Error ? err.message : 'Unable to retrieve sensor data.');
        } finally {
            setIsSensorsLoading(false);
        }
    };

    return (
        <IoTContext.Provider
            value={{
                devices, // it can now real fetched state, not "updatedDevices" derived from a local constant
                isDevicesLoading, // exposed so DevicesScreen can show "Loading devices..."
                sensors,
                isSensorsLoading, // error was that it was been hardcoded to false
                refreshSensors, // error was that it was been hardcoded to undefined
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