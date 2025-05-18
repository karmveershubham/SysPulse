package checks

type SystemReport struct {
	MachineID string `json:"machine_id"`
	Hostname  string `json:"hostname"`
	OS        string `json:"os"`

	DiskEncrypted        bool   `json:"disk_encrypted"`
	DiskEncryptionMethod string `json:"disk_encryption_method,omitempty"`

	OSUpToDate     bool   `json:"os_up_to_date"`
	CurrentVersion string `json:"current_os_version,omitempty"`
	LatestVersion  string `json:"latest_os_version,omitempty"`

	AntivirusExists bool   `json:"antivirus_exists"`
	AntivirusActive bool   `json:"antivirus_active"`
	AntivirusName   string `json:"antivirus_name,omitempty"`

	SleepOK bool `json:"sleep_ok"`
}
