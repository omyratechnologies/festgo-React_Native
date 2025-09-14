import AsyncStorage from '@react-native-async-storage/async-storage';
import { getConfig } from '../config/env';
import RazorpayCheckout from 'react-native-razorpay';

const config = getConfig();

export interface PaymentOptions {
  amount: number;
  currency?: string;
  name: string;
  description: string;
  orderId: string;
  bookingId: string;
  prefill?: {
    email?: string;
    contact?: string;
    name?: string;
  };
  notes?: {
    booking_id: string;
    payment_for: string;
    payment_type: string;
  };
}

export interface PaymentResult {
  success: boolean;
  message: string;
  paymentId?: string;
  bookingData?: any;
}

export interface BookingResponse {
  success: boolean;
  message: string;
  data: {
    booking: any;
    razorpayOrder: any;
  };
}

// ✅ Razorpay Checkout integration
export const initiatePayment = async (options: PaymentOptions): Promise<PaymentResult> => {
  try {
    console.log('Starting Razorpay payment with options:', options);

    const razorpayOptions = {
      description: options.description,
      image: 'https://your-logo-url.png', // optional
      currency: options.currency || 'INR',
      key: 'rzp_test_1DP5mmOlF5G5ag', // 🔑 replace with your live key in prod
      amount: options.amount, // in paise
      name: options.name,
      order_id: options.orderId, // from backend
      prefill: {
        email: options.prefill?.email || '',
        contact: options.prefill?.contact || '',
        name: options.prefill?.name || '',
      },
      notes: options.notes || {},
      theme: { color: '#F15A29' },
    };

    const paymentData = await RazorpayCheckout.open(razorpayOptions);

    console.log('Razorpay success:', paymentData);

    // Send paymentData to backend for verification
    // paymentData = { razorpay_payment_id, razorpay_order_id, razorpay_signature }

    return {
      success: true,
      message: 'Payment successful',
      paymentId: paymentData.razorpay_payment_id,
    };
  } catch (error: any) {
    console.error('Razorpay payment error:', error);

    return {
      success: false,
      message: error.description || 'Payment cancelled',
    };
  }
};

// ✅ BeachFest Booking
export const processBeachFestBooking = async (bookingData: any): Promise<PaymentResult> => {
  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    if (!jwtToken) {
      return { success: false, message: 'You must be logged in to book a fest.' };
    }

    const { booking, razorpayOrder } = bookingData;

    const paymentOptions: PaymentOptions = {
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'FestGo BeachFest',
      description: `Booking for ${booking.name} - ${booking.passes} passes`,
      orderId: razorpayOrder.id,
      bookingId: booking.id,
      prefill: {
        email: booking.email,
        contact: booking.phone,
        name: booking.name,
      },
      notes: {
        booking_id: booking.id,
        payment_for: 'beachfest_booking',
        payment_type: booking.payment_method,
      },
    };

    const paymentResult = await initiatePayment(paymentOptions);

    if (paymentResult.success) {
      return {
        success: true,
        message: 'Booking and payment successful!',
        paymentId: paymentResult.paymentId,
        bookingData: booking,
      };
    }

    return paymentResult;
  } catch (error: any) {
    console.error('BeachFest booking error:', error);
    return { success: false, message: error.message || 'Booking failed. Please try again.' };
  }
};


// Process Hotel booking
export const processHotelBooking = async (bookingData: any): Promise<PaymentResult> => {
  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    if (!jwtToken) {
      return {
        success: false,
        message: 'You must be logged in to book a hotel.',
      };
    }

    // Create booking
    const bookingResponse = await fetch(`${config.API_URL}/hotel-booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (!bookingResponse.ok) {
      const error = await bookingResponse.json();
      throw new Error(error.message || 'Booking failed');
    }

    const response: BookingResponse = await bookingResponse.json();

    if (!response.success) {
      return {
        success: false,
        message: response.message,
      };
    }

    const { booking, razorpayOrder } = response.data;

    // Initiate payment
    const paymentOptions: PaymentOptions = {
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'FestGo Hotel Booking',
      description: `Hotel booking for ${booking.hotel_name || 'Hotel'}`,
      orderId: razorpayOrder.id,
      bookingId: booking.id,
      prefill: {
        email: booking.email,
        contact: booking.phone,
        name: booking.guest_name,
      },
      notes: {
        booking_id: booking.id,
        payment_for: 'hotel_booking',
        payment_type: booking.payment_method,
      },
    };

    const paymentResult = await initiatePayment(paymentOptions);

    if (paymentResult.success) {
      // Update booking with payment details
      await updateBookingPaymentStatus(booking.id, paymentResult.paymentId!, 'completed');
      
      return {
        success: true,
        message: 'Hotel booking and payment successful!',
        paymentId: paymentResult.paymentId,
        bookingData: booking,
      };
    }

    return paymentResult;
  } catch (error: any) {
    console.error('Hotel booking error:', error);
    return {
      success: false,
      message: error.message || 'Booking failed. Please try again.',
    };
  }
};

// Process Event booking
export const processEventBooking = async (bookingData: any): Promise<PaymentResult> => {
  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    if (!jwtToken) {
      return {
        success: false,
        message: 'You must be logged in to book an event.',
      };
    }

    // Create booking
    const bookingResponse = await fetch(`${config.API_URL}/event-booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(bookingData),
    });

    if (!bookingResponse.ok) {
      const error = await bookingResponse.json();
      throw new Error(error.message || 'Booking failed');
    }

    const response: BookingResponse = await bookingResponse.json();

    if (!response.success) {
      return {
        success: false,
        message: response.message,
      };
    }

    const { booking, razorpayOrder } = response.data;

    // Initiate payment
    const paymentOptions: PaymentOptions = {
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'FestGo Event',
      description: `Event booking for ${booking.event_name || 'Event'}`,
      orderId: razorpayOrder.id,
      bookingId: booking.id,
      prefill: {
        email: booking.email,
        contact: booking.phone,
        name: booking.guest_name,
      },
      notes: {
        booking_id: booking.id,
        payment_for: 'event_booking',
        payment_type: booking.payment_method,
      },
    };

    const paymentResult = await initiatePayment(paymentOptions);

    if (paymentResult.success) {
      // Update booking with payment details
      await updateBookingPaymentStatus(booking.id, paymentResult.paymentId!, 'completed');
      
      return {
        success: true,
        message: 'Event booking and payment successful!',
        paymentId: paymentResult.paymentId,
        bookingData: booking,
      };
    }

    return paymentResult;
  } catch (error: any) {
    console.error('Event booking error:', error);
    return {
      success: false,
      message: error.message || 'Booking failed. Please try again.',
    };
  }
};

// Update booking payment status
const updateBookingPaymentStatus = async (bookingId: string, paymentId: string, status: string) => {
  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    if (!jwtToken) return;

    await fetch(`${config.API_URL}/update-booking-payment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        bookingId,
        paymentId,
        status,
      }),
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
  }
};

// Alternative: Direct API payment (for testing without web browser)
export const processDirectPayment = async (bookingData: any, bookingType: 'beachfest' | 'hotel' | 'event'): Promise<PaymentResult> => {
  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    if (!jwtToken) {
      return {
        success: false,
        message: 'You must be logged in to make a booking.',
      };
    }
    console.log("bookingData", bookingData);

    let endpoint = '';
    switch (bookingType) {
      case 'beachfest':
        endpoint = '/beachfest-booking';
        break;
      case 'hotel':
        endpoint = '/hotel-booking';
        break;
      case 'event':
        endpoint = '/event-booking';
        break;
    }

    const response = await fetch(`${config.API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(bookingData),
    });
    console.log("response", response);
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Booking failed');
    }

    const result: BookingResponse = await response.json();
    console.log("result", result.data);
    if (result.success) {
      // For testing, simulate successful payment
      const mockPaymentId = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      return {
        success: true,
        message: 'Booking successful! (Payment simulated for testing)',
        paymentId: mockPaymentId,
        bookingData: result.data.booking,
      };
    } else {
      return {
        success: false,
        message: result.message,
      };
    }
  } catch (error: any) {
    console.error('Direct payment error:', error);
    return {
      success: false,
      message: error.message || 'Booking failed. Please try again.',
    };
  }
};

// Verify payment signature (for webhook verification)
export const verifyPaymentSignature = (orderId: string, paymentId: string, signature: string): boolean => {
  try {
    // In production, you would verify the signature using Razorpay's verification method
    // For now, we'll return true as a placeholder
    console.log('Verifying payment signature:', { orderId, paymentId, signature });
    return true;
  } catch (error) {
    console.error('Payment signature verification failed:', error);
    return false;
  }
};

// Process payment webhook
export const processPaymentWebhook = async (webhookData: any): Promise<boolean> => {
  try {
    console.log('Processing payment webhook:', webhookData);
    
    const { order_id, payment_id, signature } = webhookData;
    
    // Verify the webhook signature
    if (!verifyPaymentSignature(order_id, payment_id, signature)) {
      console.error('Invalid webhook signature');
      return false;
    }
    
    // Update booking status based on payment status
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    if (!jwtToken) {
      console.error('No JWT token found for webhook processing');
      return false;
    }
    
    const response = await fetch(`${config.API_URL}/update-booking-payment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        orderId: order_id,
        paymentId: payment_id,
        status: webhookData.status || 'completed',
        webhookData,
      }),
    });
    
    if (!response.ok) {
      console.error('Failed to update booking payment status');
      return false;
    }
    
    console.log('Payment webhook processed successfully');
    return true;
  } catch (error) {
    console.error('Error processing payment webhook:', error);
    return false;
  }
};

// Get payment history for a user
export const getPaymentHistory = async (): Promise<any[]> => {
  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    if (!jwtToken) {
      throw new Error('You must be logged in to view payment history');
    }
    
    const response = await fetch(`${config.API_URL}/payment-history`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch payment history');
    }
    
    const data = await response.json();
    return data.payments || [];
  } catch (error: any) {
    console.error('Error fetching payment history:', error);
    throw new Error(error.message || 'Failed to fetch payment history');
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId: string, bookingType: 'beachfest' | 'hotel' | 'event'): Promise<boolean> => {
  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    if (!jwtToken) {
      throw new Error('You must be logged in to cancel a booking');
    }
    
    let endpoint = '';
    switch (bookingType) {
      case 'beachfest':
        endpoint = '/beachfest-booking/cancel';
        break;
      case 'hotel':
        endpoint = '/hotel-booking/cancel';
        break;
      case 'event':
        endpoint = '/event-booking/cancel';
        break;
    }
    
    const response = await fetch(`${config.API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ bookingId }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to cancel booking');
    }
    
    const result = await response.json();
    return result.success;
  } catch (error: any) {
    console.error('Error cancelling booking:', error);
    throw new Error(error.message || 'Failed to cancel booking');
  }
};

// Get booking details
export const getBookingDetails = async (bookingId: string, bookingType: 'beachfest' | 'hotel' | 'event'): Promise<any> => {
  try {
    const jwtToken = await AsyncStorage.getItem('jwtToken');
    if (!jwtToken) {
      throw new Error('You must be logged in to view booking details');
    }
    
    let endpoint = '';
    switch (bookingType) {
      case 'beachfest':
        endpoint = `/beachfest-booking/${bookingId}`;
        break;
      case 'hotel':
        endpoint = `/hotel-booking/${bookingId}`;
        break;
      case 'event':
        endpoint = `/event-booking/${bookingId}`;
        break;
    }
    
    const response = await fetch(`${config.API_URL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch booking details');
    }
    
    const result = await response.json();
    return result.booking;
  } catch (error: any) {
    console.error('Error fetching booking details:', error);
    throw new Error(error.message || 'Failed to fetch booking details');
  }
};
