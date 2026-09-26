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

    toggleDevice: (id: number, value: boolean) => void;
    refreshSensors: () => void; // function to refresh sensor data
    refreshDevices: () => void; // function to refresh device data and lets a retry button to re run the device fetch
                                // if it fails the first time. It is not used in the app yet, but it is a good idea to have it for future use.

    devicesError: string | null;//replacing the single error with the three separate independent error 
    sensorsError: string | null; //states for devices, sensors, and device actions to provide more granular error handling
    deviceActionError: string | null;
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

//Three separate error states for devices, sensors, and device actions to provide more granular error handling
const [devicesError, setDevicesError] = useState<string | null>(null);
const [sensorsError, setSensorsError] = useState<string | null>(null);
const [deviceActionError, setDeviceActionError] = useState<string | null>(null);


const [devices, setDevices] = useState<Device[]>([]);
const [isDevicesLoading, setIsDevicesLoading] = useState(false);



  const loadDevices = () => { //extracted the device fetch logic into a separate function so it can be called on demand (e.g., for a retry button)
        setIsDevicesLoading(true);
        setDevicesError(null); // clear any previous error before trying again

        getDevices()
            .then((data) => setDevices(data)) // success: store what the service returned
            .catch((err) => setDevicesError(err.message)) // failure: store the error message instead of crashing
            .finally(() => setIsDevicesLoading(false)); // either way: loading is done
    };

    useEffect(() => { // start fetching devices when the component mounts
        loadDevices(); // 
    }, []); 

    const toggleDevice = async (
        // Activity 10: function is now "async" because it uses "await" inside —
        // it used to be a plain function using setTimeout, now it awaits the service call
        id: number,
        value: boolean
    ) => {
        if (!isGatewayConnected) return;

        setUpdatingDeviceIds((prev) => [...prev, id]);
        setDeviceActionError(null); // clear any previous error before trying again

        try {
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

            const device = devices.find((d) => d.id === id);
            setDeviceActionError('Unable to update device ' + (device ? device.name : id) + '.');//changed to show the error message first and then the device actual name.
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
        setSensorsError(null); // clear any previous error before trying again
        // Activity 10: now "async" — awaits the service instead of using setTimeout directly
        setIsSensorsLoading(true);

        try {
            // Activity 10: replaced the inline Math.random() calculations with a call to the service — random-number 
        const data = await getSensorData();
            setSensors(data);
        } catch (err) {
            // Activity 10: new — handle a simulated sensor-fetch failure gracefully
            setSensorsError(err instanceof Error ? err.message : 'Unable to retrieve sensor data.');
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
                devicesError,
                sensorsError,
                deviceActionError,
                refreshDevices: loadDevices, 
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