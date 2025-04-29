import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Button, RadioButton, Card, Divider, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/navigation/types';
import { CourierAPI } from '@/lib/courier-api';
import { useAppSelector } from '@/store';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type DeliveryStatusUpdateRouteProp = RouteProp<RootStackParamList, 'DeliveryStatusUpdate'>;

type DeliveryStatus = 'PENDING' | 'ACCEPTED' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';

const DeliveryStatusUpdateScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<DeliveryStatusUpdateRouteProp>();
  const { deliveryId, status: currentStatus } = route.params;
  const user = useAppSelector((state) => state.auth.user);

  const [selectedStatus, setSelectedStatus] = useState<DeliveryStatus>(currentStatus as DeliveryStatus);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryDetails, setDeliveryDetails] = useState<any>(null);

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        setLoading(true);
        const data = await CourierAPI.getDeliveryDetails(deliveryId);
        setDeliveryDetails(data);
        setSelectedStatus(data.status as DeliveryStatus);
      } catch (error) {
        console.error('Error fetching delivery details:', error);
        setError('Failed to load delivery details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveryDetails();
  }, [deliveryId]);

  const handleStatusUpdate = async () => {
    if (!selectedStatus) {
      Alert.alert('Error', 'Please select a status');
      return;
    }

    try {
      setSubmitting(true);
      await CourierAPI.updateDeliveryStatus(deliveryId, selectedStatus);
      
      // Show success message
      Alert.alert(
        'Success',
        `Delivery status updated to ${formatStatus(selectedStatus)}`,
        [
          { 
            text: 'OK', 
            onPress: () => navigation.navigate('DeliveryDetails', { deliveryId }) 
          }
        ]
      );
    } catch (error) {
      console.error('Error updating delivery status:', error);
      Alert.alert('Error', 'Failed to update delivery status. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getAvailableStatuses = (): DeliveryStatus[] => {
    const allStatuses: DeliveryStatus[] = ['PENDING', 'ACCEPTED', 'PICKED_UP', 'DELIVERED', 'CANCELLED'];
    
    // Get the current status index
    const currentIndex = allStatuses.indexOf(selectedStatus);
    
    // Only allow moving forward in the workflow (except can always cancel)
    // and can't change status once delivered or cancelled
    if (selectedStatus === 'DELIVERED' || selectedStatus === 'CANCELLED') {
      return [selectedStatus];
    }
    
    // Return current status and the next logical status, plus cancelled
    return allStatuses.filter((status, index) => 
      status === selectedStatus || 
      index === currentIndex + 1 || 
      status === 'CANCELLED'
    );
  };

  // Helper function to format the status
  const formatStatus = (status: string): string => {
    return status
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getStatusDescription = (status: DeliveryStatus): string => {
    switch (status) {
      case 'PENDING':
        return 'Order received but not yet accepted.';
      case 'ACCEPTED':
        return 'You\'ve accepted the delivery and are en route to pickup.';
      case 'PICKED_UP':
        return 'You\'ve picked up the order and are delivering to customer.';
      case 'DELIVERED':
        return 'Order successfully delivered to customer.';
      case 'CANCELLED':
        return 'Delivery has been cancelled.';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#22c55e" />
        <Text style={styles.loadingText}>Loading delivery details...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          onPress={() => navigation.goBack()} 
          style={styles.actionButton}
        >
          Go Back
        </Button>
      </View>
    );
  }

  const availableStatuses = getAvailableStatuses();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Update Delivery Status</Text>
      
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.subtitle}>Select the new status:</Text>
          
          <RadioButton.Group 
            onValueChange={(value) => setSelectedStatus(value as DeliveryStatus)} 
            value={selectedStatus}
          >
            {availableStatuses.map((status) => (
              <View key={status} style={styles.radioItem}>
                <RadioButton.Item
                  label={formatStatus(status)}
                  value={status}
                  position="leading"
                  labelStyle={styles.radioLabel}
                  status={selectedStatus === status ? 'checked' : 'unchecked'}
                  color="#22c55e"
                />
                <Text style={styles.radioDescription}>
                  {getStatusDescription(status)}
                </Text>
                <Divider style={styles.divider} />
              </View>
            ))}
          </RadioButton.Group>
          
          <View style={styles.warningContainer}>
            {selectedStatus === 'CANCELLED' && (
              <Text style={styles.warningText}>
                Warning: Cancelling a delivery may affect your rating and earnings.
                Only cancel if you absolutely cannot complete the delivery.
              </Text>
            )}
            
            {selectedStatus === 'DELIVERED' && (
              <Text style={styles.confirmationText}>
                By marking this delivery as completed, you confirm that you have
                successfully delivered all items to the customer.
              </Text>
            )}
          </View>
        </Card.Content>
      </Card>
      
      <View style={styles.actionsContainer}>
        <Button
          mode="contained"
          onPress={handleStatusUpdate}
          style={styles.updateButton}
          loading={submitting}
          disabled={submitting || selectedStatus === currentStatus}
        >
          Update Status
        </Button>
        
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
          disabled={submitting}
        >
          Cancel
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  errorText: {
    fontSize: 16,
    color: '#e53e3e',
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  card: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 8,
  },
  radioItem: {
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  radioDescription: {
    marginLeft: 52,
    marginTop: -8,
    marginBottom: 8,
    fontSize: 14,
    color: '#666',
  },
  divider: {
    marginVertical: 8,
  },
  warningContainer: {
    marginTop: 16,
    padding: 8,
  },
  warningText: {
    color: '#e53e3e',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  confirmationText: {
    color: '#22c55e',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  actionsContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  updateButton: {
    marginBottom: 12,
    padding: 4,
    backgroundColor: '#22c55e',
  },
  cancelButton: {
    marginBottom: 12,
    padding: 4,
    borderColor: '#22c55e',
  },
  actionButton: {
    backgroundColor: '#22c55e',
    marginTop: 8,
  },
});

export default DeliveryStatusUpdateScreen; 