import React, { useRef, useState } from 'react';
import { View, Alert, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainTabNavigationProp, MainStackParamList } from '~/navigation/types';
import Svg, { Path } from 'react-native-svg';

type PaymentWebViewRouteProp = RouteProp<MainStackParamList, 'PaymentWebView'>;

const PaymentWebView = () => {
  const navigation = useNavigation<MainTabNavigationProp>();
  const route = useRoute<PaymentWebViewRouteProp>();
  const { razorpayOptions, onPaymentSuccess, onPaymentError } = route.params;
  
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const generateRazorpayHTML = (options: any) => {
    console.log('Generating HTML with options:', options);
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background-color: #f5f5f5;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
            }
            .container {
              background: white;
              border-radius: 12px;
              padding: 30px;
              box-shadow: 0 4px 20px rgba(0,0,0,0.1);
              max-width: 400px;
              width: 100%;
              text-align: center;
            }
            .logo {
              font-size: 24px;
              font-weight: bold;
              color: #F15A29;
              margin-bottom: 20px;
            }
            .amount {
              font-size: 32px;
              font-weight: bold;
              color: #333;
              margin-bottom: 10px;
            }
            .description {
              color: #666;
              margin-bottom: 30px;
              font-size: 16px;
            }
            .pay-button {
              background-color: #F15A29;
              color: white;
              border: none;
              padding: 15px 30px;
              border-radius: 8px;
              font-size: 18px;
              font-weight: bold;
              cursor: pointer;
              width: 100%;
              margin-bottom: 20px;
            }
            .pay-button:hover {
              background-color: #e04a1f;
            }
            .pay-button:disabled {
              background-color: #ccc;
              cursor: not-allowed;
            }
            .loading {
              display: none;
              color: #F15A29;
              font-size: 16px;
            }
            .error {
              color: #e74c3c;
              background-color: #fdf2f2;
              padding: 15px;
              border-radius: 8px;
              margin-bottom: 20px;
              border: 1px solid #fecaca;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">FestGo</div>
            <div class="amount">₹${(options.amount / 100).toFixed(2)}</div>
            <div class="description">${options.description}</div>
            
            <div id="error" class="error" style="display: none;"></div>
            
            <button id="payButton" class="pay-button" onclick="openRazorpay()">
              Pay Now
            </button>
            
            <div id="loading" class="loading">
              Processing payment...
            </div>
          </div>

          <script>
            const options = ${JSON.stringify(options)};
            
            function showError(message) {
              document.getElementById('error').textContent = message;
              document.getElementById('error').style.display = 'block';
              document.getElementById('payButton').disabled = false;
              document.getElementById('loading').style.display = 'none';
            }
            
            function showLoading() {
              document.getElementById('payButton').disabled = true;
              document.getElementById('loading').style.display = 'block';
            }
            
            function hideLoading() {
              document.getElementById('payButton').disabled = false;
              document.getElementById('loading').style.display = 'none';
            }
            
            function openRazorpay() {
              try {
                showLoading();
                
                console.log('Opening Razorpay with options:', options);
                
                const rzp = new Razorpay({
                  ...options,
                  handler: function (response) {
                    console.log('Payment successful:', response);
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                      type: 'success',
                      data: response
                    }));
                  },
                  modal: {
                    ondismiss: function() {
                      console.log('Payment modal dismissed');
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'dismissed',
                        data: null
                      }));
                      hideLoading();
                    }
                  }
                });
                
                rzp.on('payment.failed', function (response) {
                  console.log('Payment failed:', response);
                  window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'failed',
                    data: response
                  }));
                  hideLoading();
                });
                
                rzp.on('payment.captured', function (response) {
                  console.log('Payment captured:', response);
                });
                
                rzp.on('payment.authorized', function (response) {
                  console.log('Payment authorized:', response);
                });
                
                rzp.open();
              } catch (error) {
                console.error('Error opening Razorpay:', error);
                showError('Failed to initialize payment: ' + error.message);
                hideLoading();
              }
            }
            
            // Auto-open payment modal when page loads
            window.addEventListener('load', function() {
              setTimeout(openRazorpay, 500);
            });
          </script>
        </body>
      </html>
    `;
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('WebView message received:', data);
      
      switch (data.type) {
        case 'success':
          setLoading(false);
          console.log('Payment successful, navigating to success screen');
          if (onPaymentSuccess) {
            onPaymentSuccess(data.data);
          } else {
            // Navigate to success screen
            navigation.navigate('BookingSuccess', {
              bookingData: route.params.bookingData,
              paymentId: data.data.razorpay_payment_id,
              bookingType: route.params.bookingType || 'beachfest',
            });
          }
          break;
          
        case 'failed':
          setLoading(false);
          console.log('Payment failed:', data.data);
          const errorMessage = data.data?.error?.description || data.data?.error?.reason || 'Payment failed. Please try again.';
          if (onPaymentError) {
            onPaymentError(data.data);
          } else {
            Alert.alert('Payment Failed', errorMessage, [
              { text: 'Try Again', onPress: () => setError(null) },
              { text: 'Cancel', onPress: () => navigation.goBack() }
            ]);
          }
          break;
          
        case 'dismissed':
          setLoading(false);
          console.log('Payment modal dismissed');
          navigation.goBack();
          break;
          
        default:
          console.log('Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
      console.error('Raw message:', event.nativeEvent.data);
    }
  };

  const handleWebViewLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setError('Failed to load payment page. Please check your internet connection.');
    setLoading(false);
  };

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center px-6">
          <Text className="text-red-500 text-lg text-center mb-6">{error}</Text>
          <TouchableOpacity
            onPress={() => {
              setError(null);
              setLoading(true);
            }}
            className="bg-blue-600 px-6 py-3 rounded-lg">
            <Text className="text-white font-semibold">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2">
          <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
            <Path
              d="M15 18l-6-6 6-6"
              stroke="#222"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Payment</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Loading indicator */}
      {loading && (
        <View className="absolute inset-0 bg-white bg-opacity-90 justify-center items-center z-10">
          <ActivityIndicator size="large" color="#F15A29" />
          <Text className="mt-4 text-gray-600">Loading payment...</Text>
        </View>
      )}

      {/* WebView */}
      <WebView
        ref={webViewRef}
        source={{ html: generateRazorpayHTML(razorpayOptions) }}
        onMessage={handleMessage}
        onLoad={handleWebViewLoad}
        onError={handleWebViewError}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        style={{ flex: 1 }}
        originWhitelist={['*']}
        mixedContentMode="compatibility"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
      />
    </SafeAreaView>
  );
};

export default PaymentWebView;
