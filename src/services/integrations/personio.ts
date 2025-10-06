/**
 * Personio Integration Service
 * Syncs employee data with Personio HR system
 */

export interface PersonioConfig {
  clientId: string;
  clientSecret: string;
  apiUrl: string;
}

export interface PersonioEmployee {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  position: string;
  department?: string;
  hire_date?: string;
  status: string;
}

/**
 * Get Personio access token
 */
async function getAccessToken(config: PersonioConfig): Promise<string> {
  const response = await fetch(`${config.apiUrl}/v1/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: config.clientId,
      client_secret: config.clientSecret,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to authenticate with Personio');
  }

  const data = await response.json();
  return data.data.token;
}

/**
 * Fetch all employees from Personio
 */
export async function fetchPersonioEmployees(
  config: PersonioConfig
): Promise<PersonioEmployee[]> {
  const token = await getAccessToken(config);

  const response = await fetch(`${config.apiUrl}/v1/company/employees`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch employees from Personio');
  }

  const data = await response.json();
  return data.data;
}

/**
 * Sync employees from Personio to NOBA
 */
export async function syncEmployeesFromPersonio(
  config: PersonioConfig,
  companyId: number
): Promise<{ imported: number; updated: number; errors: string[] }> {
  const { prisma } = await import('@/lib/db');

  const personioEmployees = await fetchPersonioEmployees(config);
  let imported = 0;
  let updated = 0;
  const errors: string[] = [];

  for (const pEmployee of personioEmployees) {
    try {
      // Check if employee exists
      const existing = await prisma.employee.findFirst({
        where: {
          companyId,
          email: pEmployee.email,
        },
      });

      if (existing) {
        // Update existing employee
        await prisma.employee.update({
          where: { id: existing.id },
          data: {
            firstName: pEmployee.first_name,
            lastName: pEmployee.last_name,
            position: pEmployee.position,
            startDate: pEmployee.hire_date ? new Date(pEmployee.hire_date) : null,
            status: pEmployee.status === 'active' ? 'active' : 'inactive',
          },
        });
        updated++;
      } else {
        // Create new employee
        await prisma.employee.create({
          data: {
            companyId,
            email: pEmployee.email,
            firstName: pEmployee.first_name,
            lastName: pEmployee.last_name,
            position: pEmployee.position,
            startDate: pEmployee.hire_date ? new Date(pEmployee.hire_date) : null,
            status: pEmployee.status === 'active' ? 'active' : 'inactive',
          },
        });
        imported++;
      }
    } catch (error) {
      errors.push(`Failed to sync ${pEmployee.email}: ${error}`);
    }
  }

  return { imported, updated, errors };
}
