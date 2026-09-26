import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { useIoT } from '../../context/IoTContext';
import { Ionicons } from '@expo/vector-icons';


export default function SensorsScreen() {
    const {
    sensors,
    isSensorsLoading,
    sensorsError,
    refreshSensors,
  } = useIoT();
  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <Text style={styles.title}>
        Sensors
      </Text>

      <Text style={styles.subtitle}>
        Monitor your environment
      </Text>

      <TouchableOpacity
  style={styles.refreshButton}
  onPress={refreshSensors}
  disabled={isSensorsLoading}
>
  {isSensorsLoading ? (
    <ActivityIndicator size="small" color="#fff" />
  ) : (
    <Ionicons name="refresh" size={18} color="#fff" />
  )}

  <Text style={styles.refreshButtonText}>
    {isSensorsLoading ? 'Refreshing...' : 'Refresh Sensors'}
  </Text>
</TouchableOpacity>


 {/* Activity 11: full loading state, exact text the spec asks for */}
      {isSensorsLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loadingText}>
            Refreshing Sensors...
          </Text>
        </View>
      )}

      {/* Activity 11: sensor error + Retry */}
      {!isSensorsLoading && sensorsError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {sensorsError}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={refreshSensors}
          >
            <Text style={styles.retryButtonText}>
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Only show the actual readings once loading is done and there's no error */}
{!isSensorsLoading && !sensorsError && (
  <>
    {/* Temperature */}
    <View style={styles.sensorCard}>

      <View style={styles.sensorHeader}>

        <Ionicons
          name="thermometer-outline"
          size={30}
        />

        <Text style={styles.sensorName}>
          Temperature
        </Text>

      </View>

      <Text style={styles.sensorValue}>
        {sensors.temperature}°C
      </Text>

      <Text style={styles.sensorDescription}>
        Current room temperature
      </Text>

    </View>

    {/* Humidity */}
    <View style={styles.sensorCard}>

      <View style={styles.sensorHeader}>

        <Ionicons
          name="water-outline"
          size={30}
        />

        <Text style={styles.sensorName}>
          Humidity
        </Text>

      </View>

      <Text style={styles.sensorValue}>
        {sensors.humidity}%
      </Text>

      <Text style={styles.sensorDescription}>
        Current relative humidity
      </Text>

    </View>

    {/* Light Level */}
    <View style={styles.sensorCard}>

      <View style={styles.sensorHeader}>

        <Ionicons
          name="sunny-outline"
          size={30}
        />

        <Text style={styles.sensorName}>
          Light Level
        </Text>

      </View>

      <Text style={styles.sensorValue}>
        {sensors.lightLevel} lux
      </Text>

      <Text style={styles.sensorDescription}>
        Current ambient light
      </Text>

    </View>
  </>
)} 
    </ScrollView>
  );
};
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

  sensorCard: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
  },

  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  sensorName: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  sensorValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
  },

  sensorDescription: {
    fontSize: 13,
    marginTop: 5,
  },

  refreshButton: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#333',
  paddingVertical: 12,
  borderRadius: 10,
  marginBottom: 20,
  gap: 8,
},

refreshButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 14,
},

loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 14,
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

});