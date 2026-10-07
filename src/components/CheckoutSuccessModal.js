import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { formatPrice } from '../utils/catalog';

export const CheckoutSuccessModal = ({ visible, onClose, orderNumber, totalAmount }) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.celebrationIcon}>🎉</Text>
          <Text style={styles.title}>ORDER CONFIRMED</Text>
          <Text style={styles.subtitle}>
            Thank you for shopping with Wazobia Afro-Luxury.
          </Text>

          <View style={styles.detailsBox}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Order Reference:</Text>
              <Text style={styles.detailValue}>#{orderNumber}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Total Amount:</Text>
              <Text style={styles.detailValue}>{formatPrice(totalAmount)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Payment Method:</Text>
              <Text style={styles.detailValueHighlight}>Pay on Delivery (POD)</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estimated Delivery:</Text>
              <Text style={styles.detailValue}>2 - 4 Business Days</Text>
            </View>
          </View>

          <View style={styles.infoBanner}>
            <Text style={styles.infoText}>
              🇳🇬 Our courier concierge will contact you prior to dispatch. Please have cash or bank transfer ready upon delivery.
            </Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.buttonText}>BACK TO SHOPPING</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    backgroundColor: '#fcfbf9',
    borderRadius: 16,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8e6df',
  },
  celebrationIcon: {
    fontSize: 44,
    marginBottom: 10,
  },
  title: {
    fontSize: 19,
    fontWeight: '900',
    color: '#111111',
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12.5,
    color: '#666666',
    textAlign: 'center',
    marginBottom: 18,
  },
  detailsBox: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e8e6df',
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 11.5,
    color: '#777777',
  },
  detailValue: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#111111',
  },
  detailValueHighlight: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#c85a32',
  },
  infoBanner: {
    backgroundColor: '#fff8f5',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e6df',
    marginBottom: 18,
  },
  infoText: {
    fontSize: 11,
    color: '#555555',
    lineHeight: 16,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#111111',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fcfbf9',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
});
