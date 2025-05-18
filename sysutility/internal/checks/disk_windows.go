//go:build windows
// +build windows

package checks

import (
	"os/exec"
	"strings"
)

func checkDiskEncryption() (bool, string) {
	// For Windows: Use PowerShell to check BitLocker
	out, err := exec.Command("powershell", "Get-BitLockerVolume | Select-Object -ExpandProperty ProtectionStatus").Output()
	if err != nil {
		return false, "unknown"
	}

	encrypted := strings.Contains(string(out), "1") // 1 = On
	return encrypted, "BitLocker"
}
