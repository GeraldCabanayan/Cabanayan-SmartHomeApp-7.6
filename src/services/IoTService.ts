import { Device, SensorData } from '../model/IoTModels';

const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

export async function getSensorData(): Promise<SensorData> {
    await delay(1500);

    if (Math.random() < 0.1) {
        throw new Error('Unable to retrieve sensor data.');
    }

    return {
        temperature: Math.round(24 + Math.random() * 8),
        humidity: Math.round(50 + Math.random() * 30),
        lightLevel: Math.round(500 + Math.random() * 400),
    };
}

export async function getDevices(): Promise<Device[]> {
    await delay(1200);

    if (Math.random() < 0.1) {
        throw new Error('Unable to retrieve devices.');
    }

    return [
        { id: 1, name: 'Living Room Light', type: 'Smart Light', icon: 'bulb-outline', status: true },
        { id: 2, name: 'Bedroom Fan', type: 'Smart Fan', icon: 'sync-outline', status: false },
        { id: 3, name: 'Front Door Lock', type: 'Smart Lock', icon: 'lock-closed-outline', status: true },
    ];
}

export async function updateDeviceStatus(
    id: number,
    status: boolean
): Promise<boolean> {
    await delay(1000);

    if (Math.random() < 0.1) {
        throw new Error('Unable to update device.');
    }

    return status;
}