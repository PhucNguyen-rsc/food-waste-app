import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
import { useAppDispatch } from '../store';
import { setInitialized } from '../store/slices/appSlice';

export default function GetStartedScreen() {
  const dispatch = useAppDispatch();

  const handleGetStarted = () => {
    dispatch(setInitialized(true));
    console.log('Get Started pressed');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>feedr</Text>
          <Text style={styles.logoSubtitle}>FoodService</Text>
        </View>
        
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>
            It's a pleasure to meet you. We are excited that you're here so let's get started!
          </Text>
        </View>

        <Button 
          onPress={handleGetStarted}
          style={styles.button}
        >
          GET STARTED
        </Button>
      </View>

      <View style={styles.tabBar}>
        <View style={styles.tabItem}>
          <Text style={styles.tabText}>Home</Text>
        </View>
        <View style={styles.tabItem}>
          <Text style={styles.tabText}>Search</Text>
        </View>
        <View style={styles.tabItem}>
          <Text style={styles.tabText}>Notifications</Text>
        </View>
        <View style={styles.tabItem}>
          <Text style={styles.tabText}>Profile</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 60,
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  logoSubtitle: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  welcomeSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#666',
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  tabBar: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingVertical: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
}); 