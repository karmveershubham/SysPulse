//go:build linux
// +build linux

package checks

import (
	"os"
	"os/exec"
	"strings"
)

func checkAntivirus() (bool, bool, string) {
	// Common Linux antivirus packages
	knownAntiviruses := []string{
		"clamav", "sophos-av", "comodo", "avast",
		"avg", "bitdefender", "eset", "f-prot",
		"kaspersky", "mcafee", "drweb", "avira",
	}

	// First check if any common antivirus process is running
	for _, av := range knownAntiviruses {
		cmd := exec.Command("pgrep", "-f", av)
		if err := cmd.Run(); err == nil {
			// Process found, check if daemon/service is active
			serviceCmd := exec.Command("systemctl", "is-active", av)
			if serviceOut, err := serviceCmd.Output(); err == nil && strings.TrimSpace(string(serviceOut)) == "active" {
				return true, true, av
			} else {
				// Process running but service status unknown, consider it active
				return true, true, av
			}
		}
	}

	// Next check if any of these are installed
	for _, av := range knownAntiviruses {
		// Check using which command
		whichCmd := exec.Command("which", av)
		if whichOut, err := whichCmd.Output(); err == nil && len(whichOut) > 0 {
			// Check if relevant service is active
			serviceCmd := exec.Command("systemctl", "is-active", av)
			if serviceOut, err := serviceCmd.Output(); err == nil {
				isActive := strings.TrimSpace(string(serviceOut)) == "active"
				return true, isActive, av
			}
			// Package installed but status unknown
			return true, false, av
		}
	}

	// Check directory existence for common antivirus installations
	avDirs := []string{
		"/opt/kaspersky",
		"/opt/sophos",
		"/opt/comodo",
		"/opt/drweb",
		"/opt/bitdefender",
		"/var/lib/clamav",
	}

	for _, dir := range avDirs {
		if _, err := os.Stat(dir); err == nil {
			avName := strings.TrimPrefix(strings.TrimPrefix(dir, "/opt/"), "/var/lib/")

			// Check if service is running
			serviceCmd := exec.Command("systemctl", "is-active", avName)
			if serviceOut, err := serviceCmd.Output(); err == nil {
				isActive := strings.TrimSpace(string(serviceOut)) == "active"
				return true, isActive, avName
			}

			// Directory exists but status unknown
			return true, false, avName
		}
	}

	return false, false, ""
}
