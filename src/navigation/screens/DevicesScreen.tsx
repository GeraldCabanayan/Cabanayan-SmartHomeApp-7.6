import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { useIoT } from '../../context/IoTContext';

export default function DevicesScreen() {

  const { // adding the isGatewayConnected and isLoading for Activity 8
    devices,
    toggleDevice,
    isGatewayConnected, 
    updatingDeviceIds,
    isDevicesLoading,
    devicesError,
    deviceActionError,
    refreshDevices,
  } = useIoT();

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>
        Devices
      </Text>

      <Text style={styles.subtitle}>
        Control your connected devices
      </Text>

      {/* Activity 11: Gateway disconnected banner */}
      {!isGatewayConnected && (
        <View style={styles.bannerError}>
          <Text style={styles.bannerErrorText}>
            IoT Gateway is disconnected.
          </Text>
        </View>
      )}

        {/* Activity 11: shows when a specific device's toggle command failed */}
      {deviceActionError && (
        <View style={styles.bannerError}>
          <Text style={styles.bannerErrorText}>
            {deviceActionError}
          </Text>
        </View>
      )}

         {/* Activity 11: Device loading state */}
      {isDevicesLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>
            Loading devices...
          </Text>
        </View>
      )}

       {/* Activity 11: Device fetch error + Retry */}
      {!isDevicesLoading && devicesError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {devicesError}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={refreshDevices}
          >
            <Text style={styles.retryButtonText}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

     {/* Only render the device list once loading is done and there's no error */}
      {!isDevicesLoading && !devicesError && devices.map((device) => (

        <View
          key={device.id}
          style={styles.deviceCard}
        >

          <View style={styles.deviceInfo}>

            <View style={styles.iconContainer}>

              <Ionicons
                name={device.icon}
                size={28}
              />

            </View>

            <View style={styles.deviceDetails}>

              <Text style={styles.deviceName}>
                {device.name}
              </Text>

              <Text style={styles.deviceType}>
                {device.type}
              </Text>

              <Text style={styles.deviceState}>
                {updatingDeviceIds.includes(device.id) ? 'Updating' : device.status ? 'ON' : 'OFF'} {/* Display Updating while a device command is processing */}

              </Text>

            </View>

          </View>

          <Switch
            value={device.status}
            /* Disable the switch if the gateway is not connected or if a device command is processing */
            disabled={!isGatewayConnected || updatingDeviceIds.includes(device.id)} 
            onValueChange={(value) => {
              toggleDevice(device.id, value);
            }}
          />

        </View>

      ))}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 25,
  },

    bannerError: {
    backgroundColor: '#fdecea',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },

  bannerErrorText: {
    color: '#b3261e',
    fontSize: 13,
    fontWeight: '600',
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },

   errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },

  errorText: {
    fontSize: 14,
    color: '#b3261e',
    marginBottom: 15,
    textAlign: 'center',
  },

  retryButton: {
    backgroundColor: '#333',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },

  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
  },

  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  deviceDetails: {
    flex: 1,
  },

  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  deviceType: {
    fontSize: 13,
    marginTop: 3,
  },

  deviceState: {
    fontSize: 12,
    marginTop: 5,
  },

});