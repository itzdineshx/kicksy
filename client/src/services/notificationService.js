// Notification Service for generating and managing notifications
// This service handles different types of notifications including discounts, price drops, etc.

export class NotificationService {
  constructor(appContext) {
    this.appContext = appContext;
    this.notificationTypes = {
      DISCOUNT: 'discount',
      PRICE_DROP: 'price_drop',
      NEW_EVENT: 'new_event',
      REMINDER: 'reminder',
      BOOKING_CONFIRMATION: 'booking_confirmation',
      PAYMENT_SUCCESS: 'payment_success',
      EVENT_REMINDER: 'event_reminder',
      LOYALTY_REWARD: 'loyalty_reward'
    };
  }

  // Generate sample notifications for demo purposes
  generateSampleNotifications() {
    const sampleNotifications = [
      {
        type: this.notificationTypes.DISCOUNT,
        title: '🎉 Flash Sale Alert!',
        message: 'Get 20% off on all cricket tickets for the next 2 hours! Limited time offer.',
        action: 'Book Now',
        priority: 'high',
        data: {
          discount: 20,
          category: 'cricket',
          expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString()
        }
      },
      {
        type: this.notificationTypes.PRICE_DROP,
        title: '💰 Price Drop Alert',
        message: 'Tickets for India vs England T20 have dropped by ₹500! Book now to save.',
        action: 'View Event',
        priority: 'medium',
        data: {
          eventId: 'india-vs-england-t20',
          priceDrop: 500,
          newPrice: 2500
        }
      },
      {
        type: this.notificationTypes.NEW_EVENT,
        title: '⚽ New Event Added',
        message: 'Pro Kabaddi League Final tickets are now available! Don\'t miss out.',
        action: 'Book Tickets',
        priority: 'low',
        data: {
          eventId: 'pkl-final-2025',
          eventType: 'kabaddi'
        }
      },
      {
        type: this.notificationTypes.REMINDER,
        title: '⏰ Booking Reminder',
        message: 'Your cart has items expiring in 10 minutes. Complete your booking now!',
        action: 'Checkout',
        priority: 'high',
        data: {
          cartItems: 2,
          expiresIn: 10
        }
      },
      {
        type: this.notificationTypes.LOYALTY_REWARD,
        title: '🎁 Loyalty Reward Unlocked!',
        message: 'You\'ve earned 100 points! Redeem them for exclusive discounts.',
        action: 'Redeem',
        priority: 'medium',
        data: {
          points: 100,
          rewardType: 'discount'
        }
      }
    ];

    return sampleNotifications;
  }

  // Add a notification
  addNotification(notification) {
    if (this.appContext && this.appContext.addNotification) {
      this.appContext.addNotification(notification);
    }
  }

  // Generate discount notification
  createDiscountNotification(discount, category, expiresInHours = 24) {
    return {
      type: this.notificationTypes.DISCOUNT,
      title: `🎉 ${discount}% Off ${category} Tickets!`,
      message: `Flash sale alert! Get ${discount}% off on all ${category} tickets. Limited time offer!`,
      action: 'Book Now',
      priority: 'high',
      data: {
        discount,
        category,
        expiresAt: new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString()
      }
    };
  }

  // Generate price drop notification
  createPriceDropNotification(eventTitle, priceDrop, newPrice) {
    return {
      type: this.notificationTypes.PRICE_DROP,
      title: '💰 Price Drop Alert',
      message: `Tickets for ${eventTitle} have dropped by ₹${priceDrop}! New price: ₹${newPrice}`,
      action: 'View Event',
      priority: 'medium',
      data: {
        eventTitle,
        priceDrop,
        newPrice
      }
    };
  }

  // Generate new event notification
  createNewEventNotification(eventTitle, eventType) {
    return {
      type: this.notificationTypes.NEW_EVENT,
      title: '🎪 New Event Added',
      message: `${eventTitle} tickets are now available! Book your seats now.`,
      action: 'Book Tickets',
      priority: 'low',
      data: {
        eventTitle,
        eventType
      }
    };
  }

  // Generate cart reminder notification
  createCartReminderNotification(cartItemsCount, expiresInMinutes = 10) {
    return {
      type: this.notificationTypes.REMINDER,
      title: '⏰ Booking Reminder',
      message: `Your cart has ${cartItemsCount} item(s) expiring in ${expiresInMinutes} minutes. Complete your booking now!`,
      action: 'Checkout',
      priority: 'high',
      data: {
        cartItems: cartItemsCount,
        expiresIn: expiresInMinutes
      }
    };
  }

  // Generate booking confirmation notification
  createBookingConfirmationNotification(eventTitle, bookingId) {
    return {
      type: this.notificationTypes.BOOKING_CONFIRMATION,
      title: '✅ Booking Confirmed!',
      message: `Your booking for ${eventTitle} has been confirmed. Booking ID: ${bookingId}`,
      action: 'View Booking',
      priority: 'medium',
      data: {
        eventTitle,
        bookingId
      }
    };
  }

  // Generate payment success notification
  createPaymentSuccessNotification(amount, eventTitle) {
    return {
      type: this.notificationTypes.PAYMENT_SUCCESS,
      title: '💳 Payment Successful!',
      message: `Payment of ₹${amount} for ${eventTitle} has been processed successfully.`,
      action: 'View Receipt',
      priority: 'medium',
      data: {
        amount,
        eventTitle
      }
    };
  }

  // Generate loyalty reward notification
  createLoyaltyRewardNotification(points, rewardType) {
    return {
      type: this.notificationTypes.LOYALTY_REWARD,
      title: '🎁 Loyalty Reward Unlocked!',
      message: `You've earned ${points} points! Redeem them for exclusive ${rewardType}.`,
      action: 'Redeem',
      priority: 'medium',
      data: {
        points,
        rewardType
      }
    };
  }

  // Simulate real-time notifications (for demo purposes)
  startNotificationSimulation() {
    // Generate initial sample notifications
    const sampleNotifications = this.generateSampleNotifications();
    
    // Add notifications with delays to simulate real-time updates
    sampleNotifications.forEach((notification, index) => {
      setTimeout(() => {
        this.addNotification(notification);
      }, (index + 1) * 3000); // 3 seconds between each notification
    });

    // Simulate ongoing notifications
    this.scheduleRandomNotifications();
  }

  // Schedule random notifications for demo
  scheduleRandomNotifications() {
    const notificationTemplates = [
      () => this.createDiscountNotification(
        Math.floor(Math.random() * 30) + 10, // 10-40% discount
        ['cricket', 'football', 'kabaddi', 'hockey'][Math.floor(Math.random() * 4)],
        Math.floor(Math.random() * 48) + 1 // 1-48 hours
      ),
      () => this.createPriceDropNotification(
        ['India vs Australia', 'Mumbai vs Delhi', 'PKL Final', 'ISL Championship'][Math.floor(Math.random() * 4)],
        Math.floor(Math.random() * 1000) + 100, // ₹100-1100 drop
        Math.floor(Math.random() * 3000) + 1000 // ₹1000-4000 new price
      ),
      () => this.createNewEventNotification(
        ['T20 World Cup', 'Pro Kabaddi League', 'Indian Super League', 'Hockey World Cup'][Math.floor(Math.random() * 4)],
        ['cricket', 'kabaddi', 'football', 'hockey'][Math.floor(Math.random() * 4)]
      ),
      () => this.createLoyaltyRewardNotification(
        Math.floor(Math.random() * 200) + 50, // 50-250 points
        ['discounts', 'free tickets', 'exclusive access'][Math.floor(Math.random() * 3)]
      )
    ];

    // Schedule random notifications every 30-60 seconds
    const scheduleNext = () => {
      const delay = Math.floor(Math.random() * 30000) + 30000; // 30-60 seconds
      setTimeout(() => {
        const randomTemplate = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
        this.addNotification(randomTemplate());
        scheduleNext(); // Schedule the next one
      }, delay);
    };

    // Start the first random notification after 10 seconds
    setTimeout(scheduleNext, 10000);
  }

  // Stop notification simulation
  stopNotificationSimulation() {
    // Clear any pending timeouts
    if (this.notificationTimeouts) {
      this.notificationTimeouts.forEach(timeout => clearTimeout(timeout));
      this.notificationTimeouts = [];
    }
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
