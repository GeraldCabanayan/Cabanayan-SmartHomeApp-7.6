import { Device, SensorData } from '../model/IoTModels';
import { API_URL } from '../config/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options,
    });

    if (!response.ok) {
        let message = 'Request failed.';
        try {
            const body = await response.json();
            if (body?.error) message = body.error;
        } catch {
            // ignore non-JSON error bodies
        }
        throw new Error(message);
    }

    return response.json() as Promise<T>;
}

export function getSensorData(): Promise<SensorData> {
    return request<SensorData>('/sensors');
}

export function getDevices(): Promise<Device[]> {
    return request<Device[]>('/devices');
}
export async function updateDeviceStatus(
    id: number,
    status: boolean
): Promise<boolean> {
    const result = await request<{ id: number; status: boolean }>(
        `/devices/${id}`,
        { method: 'PATCH', body: JSON.stringify({ status }) }
    );
    return result.status;
}
