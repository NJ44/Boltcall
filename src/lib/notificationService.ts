import { supabase } from './supabase';

export interface NotificationData {
  userId: string;
  type: string;
  title: string;
  message: string;
  deliveryMethod?: 'email' | 'sms' | 'push' | 'in_app';
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export interface NotificationPreferences {
  id: string;
  user_id: string;
  // Notification types
  appointment_booked: boolean;
  appointment_cancelled: boolean;
  appointment_rescheduled: boolean;
  appointment_reminder: boolean;
  missed_calls: boolean;
  new_voicemail: boolean;
  call_completed: boolean;
  call_failed: boolean;
  new_lead: boolean;
  lead_converted: boolean;
  lead_lost: boolean;
  sms_received: boolean;
  sms_failed: boolean;
  whatsapp_received: boolean;
  whatsapp_failed: boolean;
  payment_received: boolean;
  payment_failed: boolean;
  invoice_overdue: boolean;
  agent_offline: boolean;
  agent_error: boolean;
  system_maintenance: boolean;
  review_received: boolean;
  negative_review: boolean;
  // Delivery methods
  email_notifications: boolean;
  sms_notifications: boolean;
  push_notifications: boolean;
  in_app_notifications: boolean;
  // Timing
  instant_notifications: boolean;
  daily_digest: boolean;
  weekly_digest: boolean;
  quiet_hours_enabled: boolean;
  quiet_hours_start: string;
  quiet_hours_end: string;
  quiet_hours_timezone: string;
  weekend_notifications: boolean;
  // Contact info
  notification_email: string;
  notification_phone: string;
}

class NotificationService {
  /**
   * Get user's notification preferences
   */
  async getUserPreferences(userId: string): Promise<NotificationPreferences | null> {
    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching notification preferences:', error);
      return null;
    }
  }

  /**
   * Check if user should receive a specific notification
   */
  async shouldSendNotification(
    userId: string, 
    notificationType: string, 
    deliveryMethod: string = 'in_app'
  ): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('should_send_notification', {
          p_user_id: userId,
          p_notification_type: notificationType,
          p_delivery_method: deliveryMethod
        });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error checking notification permission:', error);
      return false;
    }
  }

  /**
   * Send a notification to a user
   */
  async sendNotification(notificationData: NotificationData): Promise<string | null> {
    const { userId, type, title, message, deliveryMethod = 'in_app', relatedEntityType, relatedEntityId } = notificationData;

    try {
      // Check if user should receive this notification
      const shouldSend = await this.shouldSendNotification(userId, type, deliveryMethod);
      if (!shouldSend) {
        console.log(`Notification blocked by user preferences: ${type} for user ${userId}`);
        return null;
      }

      // Get user preferences for contact info
      const preferences = await this.getUserPreferences(userId);
      if (!preferences) {
        console.error('No notification preferences found for user:', userId);
        return null;
      }

      // Determine recipient contact info
      let recipientEmail = null;
      let recipientPhone = null;

      if (deliveryMethod === 'email') {
        recipientEmail = preferences.notification_email || null;
        if (!recipientEmail) {
          console.error('No email address configured for user:', userId);
          return null;
        }
      }

      if (deliveryMethod === 'sms') {
        recipientPhone = preferences.notification_phone || null;
        if (!recipientPhone) {
          console.error('No phone number configured for user:', userId);
          return null;
        }
      }

      // Log the notification
      const { data, error } = await supabase
        .rpc('log_notification', {
          p_user_id: userId,
          p_notification_type: type,
          p_title: title,
          p_message: message,
          p_delivery_method: deliveryMethod,
          p_recipient_email: recipientEmail,
          p_recipient_phone: recipientPhone,
          p_related_entity_type: relatedEntityType,
          p_related_entity_id: relatedEntityId
        });

      if (error) throw error;

      const logId = data;

      // Send the notification based on delivery method
      try {
        switch (deliveryMethod) {
          case 'email':
            await this.sendEmailNotification(recipientEmail!, title, message);
            break;
          case 'sms':
            await this.sendSMSNotification(recipientPhone!, message);
            break;
          case 'push':
            await this.sendPushNotification(userId, title, message);
            break;
          case 'in_app':
            // In-app notifications are handled by the log itself
            break;
        }

        // Update notification status to sent
        await this.updateNotificationStatus(logId, 'sent');
        return logId;
      } catch (sendError) {
        // Update notification status to failed
        const errorMessage = sendError instanceof Error ? sendError.message : 'Unknown error';
        await this.updateNotificationStatus(logId, 'failed', errorMessage);
        throw sendError;
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      return null;
    }
  }

  /**
   * Send email notification
   */
  private async sendEmailNotification(email: string, title: string, message: string): Promise<void> {
    // TODO: Integrate with email service (SendGrid, AWS SES, etc.)
    console.log(`Sending email to ${email}: ${title} - ${message}`);
    
    // For now, just simulate sending
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Send SMS notification
   */
  private async sendSMSNotification(phone: string, message: string): Promise<void> {
    // TODO: Integrate with SMS service (Twilio, AWS SNS, etc.)
    console.log(`Sending SMS to ${phone}: ${message}`);
    
    // For now, just simulate sending
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Send push notification
   */
  private async sendPushNotification(userId: string, title: string, message: string): Promise<void> {
    // TODO: Integrate with push notification service (Firebase, OneSignal, etc.)
    console.log(`Sending push notification to user ${userId}: ${title} - ${message}`);
    
    // For now, just simulate sending
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  /**
   * Update notification status
   */
  async updateNotificationStatus(logId: string, status: string, errorMessage?: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('update_notification_status', {
          p_log_id: logId,
          p_status: status,
          p_error_message: errorMessage || null
        });

      if (error) throw error;
      return data || false;
    } catch (error) {
      console.error('Error updating notification status:', error);
      return false;
    }
  }

  /**
   * Get user's notification history
   */
  async getNotificationHistory(userId: string, limit: number = 50): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('notification_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching notification history:', error);
      return [];
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(userId: string, days: number = 30): Promise<any> {
    try {
      const { data, error } = await supabase
        .rpc('get_notification_stats', {
          p_user_id: userId,
          p_days: days
        });

      if (error) throw error;
      return data?.[0] || {};
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      return {};
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(logId: string): Promise<boolean> {
    return this.updateNotificationStatus(logId, 'read');
  }

  /**
   * Send bulk notifications
   */
  async sendBulkNotifications(notifications: NotificationData[]): Promise<(string | null)[]> {
    const results = await Promise.allSettled(
      notifications.map(notification => this.sendNotification(notification))
    );

    return results.map(result => 
      result.status === 'fulfilled' ? result.value : null
    );
  }

  /**
   * Helper methods for common notification types
   */
  async sendAppointmentBookedNotification(userId: string, appointmentDetails: any): Promise<string | null> {
    return this.sendNotification({
      userId,
      type: 'appointment_booked',
      title: 'New Appointment Booked',
      message: `New appointment scheduled for ${appointmentDetails.date} at ${appointmentDetails.time}`,
      relatedEntityType: 'appointment',
      relatedEntityId: appointmentDetails.id
    });
  }

  async sendMissedCallNotification(userId: string, callDetails: any): Promise<string | null> {
    return this.sendNotification({
      userId,
      type: 'missed_calls',
      title: 'Missed Call',
      message: `Missed call from ${callDetails.from} at ${callDetails.time}`,
      relatedEntityType: 'call',
      relatedEntityId: callDetails.id
    });
  }

  async sendNewLeadNotification(userId: string, leadDetails: any): Promise<string | null> {
    return this.sendNotification({
      userId,
      type: 'new_lead',
      title: 'New Lead Received',
      message: `New lead: ${leadDetails.name} - ${leadDetails.source}`,
      relatedEntityType: 'lead',
      relatedEntityId: leadDetails.id
    });
  }

  async sendPaymentReceivedNotification(userId: string, paymentDetails: any): Promise<string | null> {
    return this.sendNotification({
      userId,
      type: 'payment_received',
      title: 'Payment Received',
      message: `Payment of $${paymentDetails.amount} received from ${paymentDetails.customer}`,
      relatedEntityType: 'payment',
      relatedEntityId: paymentDetails.id
    });
  }
}

// Export singleton instance
export const notificationService = new NotificationService();
export default notificationService;
