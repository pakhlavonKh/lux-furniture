import telegramService from '../services/telegram_service.js';

/**
 * Get Telegram configuration status
 */
export const getTelegramStatus = async (req, res) => {
  try {
    const isConfigured = telegramService.isConfigured();
    const testResult = await telegramService.testConnection();

    res.status(200).json({
      success: true,
      configured: isConfigured,
      bot_token: process.env.TELEGRAM_BOT_TOKEN ? '***configured***' : 'not set',
      group_chat_id: process.env.TELEGRAM_GROUP_CHAT_ID ? '***configured***' : 'not set',
      connection_test: testResult,
    });
  } catch (error) {
    console.error('Get Telegram status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get Telegram status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Test Telegram connection
 */
export const testTelegramConnection = async (req, res) => {
  try {
    const testResult = await telegramService.testConnection();

    res.status(testResult.success ? 200 : 400).json({
      success: testResult.success,
      message: testResult.message,
      bot: testResult.bot,
    });
  } catch (error) {
    console.error('Test Telegram connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Connection test failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Send test message to group
 */
export const sendTestMessage = async (req, res) => {
  try {
    if (!telegramService.isConfigured()) {
      return res.status(400).json({
        success: false,
        message: 'Telegram bot not configured',
      });
    }

    const testMessage = `
<b>✅ Test Message from Manaku Admin</b>

This is a test message to verify Telegram bot configuration.

<b>Status:</b> Working correctly!
<b>Time:</b> ${new Date().toLocaleString()}
    `.trim();

    const result = await telegramService.sendMessage(testMessage);

    if (result) {
      return res.status(200).json({
        success: true,
        message: 'Test message sent successfully',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to send test message',
    });
  } catch (error) {
    console.error('Send test message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

/**
 * Handle contact form submission
 */
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Send Telegram notification
    const contactData = {
      name: name.trim(),
      email: email.toLowerCase(),
      phone: phone?.trim() || null,
      subject: subject.trim(),
      message: message.trim(),
    };

    await telegramService.notifyContactForm(contactData);

    res.status(200).json({
      success: true,
      message: 'Contact form submitted successfully',
    });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};
