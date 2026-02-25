import axios from 'axios';

class TelegramService {
  constructor() {
    this.bot_token = process.env.TELEGRAM_BOT_TOKEN;
    this.group_chat_id = process.env.TELEGRAM_GROUP_CHAT_ID;
    this.api_url = `https://api.telegram.org/bot${this.bot_token}`;
  }

  /**
   * Check if Telegram bot is configured
   */
  isConfigured() {
    return !!this.bot_token && !!this.group_chat_id;
  }

  /**
   * Send a message to the configured group
   * @param {string} message - The message text
   * @param {object} options - Additional options (parse_mode, etc)
   * @returns {Promise<object>} - API response
   */
  async sendMessage(message, options = {}) {
    try {
      if (!this.isConfigured()) {
        console.warn('Telegram bot not configured');
        return null;
      }

      const response = await axios.post(`${this.api_url}/sendMessage`, {
        chat_id: this.group_chat_id,
        text: message,
        parse_mode: options.parse_mode || 'HTML',
        disable_web_page_preview: options.disable_web_page_preview || true,
      });

      return response.data;
    } catch (error) {
      console.error('Telegram API error:', error.message);
      return null;
    }
  }

  /**
   * Format order notification message
   */
  formatOrderMessage(orderData) {
    const {
      orderId,
      customerName,
      customerEmail,
      customerPhone,
      amount,
      currency,
      products,
      paymentMethod,
    } = orderData;

    const productList = products
      .map((p) => `  • <b>${p.name}</b> - ${p.quantity}x €${p.price}`)
      .join('\n');

    return `
<b>🛍️ New Order Placed</b>

<b>Order ID:</b> #${orderId}
<b>Customer:</b> ${customerName}
<b>Email:</b> ${customerEmail}
<b>Phone:</b> ${customerPhone}

<b>Products:</b>
${productList}

<b>Total:</b> €${amount} ${currency}
<b>Payment Method:</b> ${paymentMethod}

<b>Status:</b> Pending confirmation
<b>Time:</b> ${new Date().toLocaleString()}
    `.trim();
  }

  /**
   * Format contact form message
   */
  formatContactMessage(contactData) {
    const { name, email, phone, subject, message } = contactData;

    return `
<b>📧 New Contact Form Submission</b>

<b>Name:</b> ${name}
<b>Email:</b> ${email}
<b>Phone:</b> ${phone || 'Not provided'}

<b>Subject:</b> ${subject}

<b>Message:</b>
${message}

<b>Received:</b> ${new Date().toLocaleString()}
    `.trim();
  }

  /**
   * Format payment notification message
   */
  formatPaymentMessage(paymentData) {
    const { transactionId, amount, currency, status, method, userId } = paymentData;

    return `
<b>💳 Payment ${status.toUpperCase()}</b>

<b>Transaction ID:</b> <code>${transactionId}</code>
<b>Amount:</b> €${amount} ${currency}
<b>Method:</b> ${method}
<b>Status:</b> ${status}
<b>User ID:</b> ${userId}

<b>Time:</b> ${new Date().toLocaleString()}
    `.trim();
  }

  /**
   * Format user registration message
   */
  formatUserRegistrationMessage(userData) {
    const { email, name, isAdmin } = userData;

    return `
<b>👤 New User Registration</b>

<b>Email:</b> ${email}
<b>Name:</b> ${name}
<b>Role:</b> ${isAdmin ? '🔑 Admin' : 'User'}

<b>Registered:</b> ${new Date().toLocaleString()}
    `.trim();
  }

  /**
   * Format inventory alert message
   */
  formatInventoryAlertMessage(productData) {
    const { productId, productName, currentStock, threshold } = productData;

    return `
<b>⚠️ Low Inventory Alert</b>

<b>Product:</b> ${productName}
<b>Product ID:</b> ${productId}
<b>Current Stock:</b> ${currentStock} units
<b>Threshold:</b> ${threshold} units

<b>Alert:</b> Stock is running low!
<b>Time:</b> ${new Date().toLocaleString()}
    `.trim();
  }

  /**
   * Send order notification
   */
  async notifyOrder(orderData) {
    const message = this.formatOrderMessage(orderData);
    return this.sendMessage(message);
  }

  /**
   * Send contact form notification
   */
  async notifyContactForm(contactData) {
    const message = this.formatContactMessage(contactData);
    return this.sendMessage(message);
  }

  /**
   * Send payment notification
   */
  async notifyPayment(paymentData) {
    const message = this.formatPaymentMessage(paymentData);
    return this.sendMessage(message);
  }

  /**
   * Send user registration notification
   */
  async notifyUserRegistration(userData) {
    const message = this.formatUserRegistrationMessage(userData);
    return this.sendMessage(message);
  }

  /**
   * Send inventory alert
   */
  async alertInventory(productData) {
    const message = this.formatInventoryAlertMessage(productData);
    return this.sendMessage(message);
  }

  /**
   * Test connection to Telegram bot
   */
  async testConnection() {
    try {
      if (!this.bot_token) {
        return {
          success: false,
          message: 'Bot token not configured',
        };
      }

      const response = await axios.get(`${this.api_url}/getMe`);

      if (response.data.ok) {
        return {
          success: true,
          message: 'Bot connected successfully',
          bot: response.data.result,
        };
      }

      return {
        success: false,
        message: 'Failed to connect to bot',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
  }
}

export default new TelegramService();
