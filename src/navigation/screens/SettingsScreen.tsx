import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';

export default function SettingsScreen() {
 //it will pull real connection state from Context instead of faking it locally
  const { isGatewayConnected, toggleGatewayConnection } = useIoT();

//removing the autoconnect state and toggle from local state and instead using the real connection state from Context
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ScrollView style={styles.container}>

      {/* Header */}

      <Text style={styles.title}>
        Settings
      </Text>

      <Text style={styles.subtitle}>
        Configure your IoT application
      </Text>


      {/* General Settings */}

      <Text style={styles.sectionTitle}>
        General
      </Text>


      {/* Notifications */}

      <View style={styles.settingCard}>

        <View style={styles.settingInfo}>

          <Ionicons
            name="notifications-outline"
            size={26}
          />

          <View style={styles.settingText}>

            <Text style={styles.settingName}>
              Notifications
            </Text>

            <Text style={styles.settingDescription}>
              Receive alerts from your IoT devices
            </Text>

          </View>

        </View>

        <Switch
          value={notifications}
          onValueChange={setNotifications}
        />

      </View>


      {/* Auto Connect */}

      <View style={styles.settingCard}>

        <View style={styles.settingInfo}>

          <Ionicons
            name="wifi-outline"
            size={26}
          />

          <View style={styles.settingText}>

            <Text style={styles.settingName}>
              Gateway Connection
            </Text>

            <Text style={styles.settingDescription}>
              Turn on/off the IoT Gateway connection
            </Text>

          </View>

        </View>

        <Switch
          value={isGatewayConnected}
          onValueChange={toggleGatewayConnection}
        />

      </View>


      {/* Dark Mode */}

      <View style={styles.settingCard}>

        <View style={styles.settingInfo}>

          <Ionicons
            name="moon-outline"
            size={26}
          />

          <View style={styles.settingText}>

            <Text style={styles.settingName}>
              Dark Mode
            </Text>

            <Text style={styles.settingDescription}>
              Use a darker application appearance
            </Text>

          </View>

        </View>

        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
        />

      </View>


      {/* Connection */}

      <Text style={styles.sectionTitle}>
        Connection
      </Text>


      <View style={styles.connectionCard}>

        <View style={styles.connectionInfo}>

          <Ionicons
            name="cloud-done-outline"
            size={30}
          />

          <View>

            <Text style={styles.connectionTitle}>
              IoT Gateway
            </Text>

            <Text style={styles.connectionStatus}>
              Connected
            </Text>

          </View>

        </View>

      </View>

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

  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 10,
  },

  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 12,
  },

  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  settingText: {
    marginLeft: 15,
    flex: 1,
  },

  settingName: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  settingDescription: {
    fontSize: 12,
    marginTop: 4,
  },

  connectionCard: {
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
  },

  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  connectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
  },

  connectionStatus: {
    fontSize: 13,
    marginLeft: 15,
    marginTop: 3,
  },

});