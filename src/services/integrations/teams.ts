/**
 * Microsoft Teams Integration Service
 * Handles Teams API interactions for notifications
 */

export interface TeamsConfig {
  webhookUrl: string;
}

/**
 * Send adaptive card to Teams channel
 */
export async function sendTeamsMessage(
  config: TeamsConfig,
  title: string,
  text: string,
  facts?: Array<{ name: string; value: string }>
): Promise<void> {
  const card = {
    '@type': 'MessageCard',
    '@context': 'https://schema.org/extensions',
    summary: title,
    themeColor: '0078D4',
    title,
    text,
    ...(facts && {
      sections: [
        {
          facts,
        },
      ],
    }),
  };

  await fetch(config.webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(card),
  });
}

/**
 * Notify about test completion
 */
export async function notifyTestCompleted(
  config: TeamsConfig,
  employeeName: string,
  scores: Record<string, number>
): Promise<void> {
  await sendTeamsMessage(
    config,
    'Test Completed',
    `${employeeName} has completed their personality assessment`,
    [
      { name: 'Openness', value: scores.O.toString() },
      { name: 'Conscientiousness', value: scores.C.toString() },
      { name: 'Extraversion', value: scores.E.toString() },
      { name: 'Agreeableness', value: scores.A.toString() },
      { name: 'Neuroticism', value: scores.N.toString() },
    ]
  );
}

/**
 * Notify about new employee
 */
export async function notifyEmployeeAdded(
  config: TeamsConfig,
  employeeName: string,
  position: string
): Promise<void> {
  await sendTeamsMessage(
    config,
    'New Employee Added',
    `${employeeName} has been added to the team`,
    [{ name: 'Position', value: position }]
  );
}
