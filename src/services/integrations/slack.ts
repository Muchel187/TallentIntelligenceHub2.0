/**
 * Slack Integration Service
 * Handles Slack API interactions for notifications
 */

export interface SlackConfig {
  accessToken: string;
  channelId: string;
  webhookUrl?: string;
}

/**
 * Send message to Slack channel
 */
export async function sendSlackMessage(
  config: SlackConfig,
  message: string
): Promise<void> {
  // Use webhook if available (simpler)
  if (config.webhookUrl) {
    await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });
    return;
  }

  // Otherwise use API with token
  await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.accessToken}`,
    },
    body: JSON.stringify({
      channel: config.channelId,
      text: message,
    }),
  });
}

/**
 * Notify about test completion
 */
export async function notifyTestCompleted(
  config: SlackConfig,
  employeeName: string,
  scores: Record<string, number>
): Promise<void> {
  const message = `
:white_check_mark: *Test Completed*
*Employee:* ${employeeName}
*Big Five Scores:*
• Openness: ${scores.O}
• Conscientiousness: ${scores.C}
• Extraversion: ${scores.E}
• Agreeableness: ${scores.A}
• Neuroticism: ${scores.N}
  `.trim();

  await sendSlackMessage(config, message);
}

/**
 * Notify about new employee added
 */
export async function notifyEmployeeAdded(
  config: SlackConfig,
  employeeName: string,
  position: string
): Promise<void> {
  const message = `:bust_in_silhouette: New employee added: *${employeeName}* (${position})`;
  await sendSlackMessage(config, message);
}
