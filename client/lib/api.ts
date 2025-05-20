// Type definitions for system data
export interface SystemReport {
  machine_id: string;
  hostname: string;
  os: string;
  current_os_version: string;
  latest_os_version: string;
  os_up_to_date: boolean;
  antivirus_exists: boolean;
  antivirus_active: boolean;
  antivirus_name: string;
  disk_encrypted: boolean;
  disk_encryption_method: string;
  sleep_ok: boolean;
  reported_at: string;
  __v: number;
}

const API_URL = "http://localhost:5000/api/systems"; // Replace with your actual API URL

// Get all systems
export async function getAllSystems(): Promise<SystemReport[]> {
  try {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) throw new Error('Failed to fetch systems');
    return await response.json();
  } catch (error) {
    console.error("Error fetching systems:", error);
    return [];
  }
}


// Get system by ID
export async function getSystemById(id: string): Promise<SystemReport | null> {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Failed to fetch system');
    return await response.json();
  } catch (error) {
    console.error(`Error fetching system ${id}:`, error);
    return null;
  }
}

// Get filtered systems
export async function getFilteredSystems(
  filters: Record<string, string>
): Promise<SystemReport[]> {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_URL}/filters?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch filtered systems');
    return await response.json();
  } catch (error) {
    console.error("Error fetching filtered systems:", error);
    return [];
  }
}
