//go:build darwin
// +build darwin

package checks

import (
	"os/exec"
	"strings"
	"regexp"
)

func checkDiskEncryption() (bool, string) {
	// Check for FileVault encryption
	out, err := exec.Command("fdesetup", "status").Output()
	if err == nil {
		outputStr := string(out)
		
		// Check if FileVault is enabled
		if strings.Contains(outputStr, "FileVault is On") {
			return true, "FileVault"
		}
	}
	
	// Alternative method: check using diskutil
	diskutil, err := exec.Command("diskutil", "apfs", "list").Output()
	if err == nil {
		outputStr := string(diskutil)
		
		// Look for Encryption Status: Yes
		encryptionRegex := regexp.MustCompile(`(?i)Encryption\s*:\s*(Yes|Encrypted)`)
		if encryptionRegex.MatchString(outputStr) {
			return true, "FileVault (APFS)"
		}
	}
	
	// Check for CoreStorage encryption (older macOS versions)
	csOut, err := exec.Command("diskutil", "cs", "list").Output()
	if err == nil {
		outputStr := string(csOut)
		
		// Look for Encryption Status: Yes or Locked
		encryptionRegex := regexp.MustCompile(`(?i)Encryption\s*:\s*(Yes|Encrypted|Locked)`)
		if encryptionRegex.MatchString(outputStr) {
			return true, "FileVault (CoreStorage)"
		}
    }
    
    // Check for VeraCrypt volumes
    veracryptOut, err := exec.Command("veracrypt", "--list").Output()
    if err == nil && len(veracryptOut) > 0 && !strings.Contains(string(veracryptOut), "No volumes mounted") {
        return true, "VeraCrypt"
    }
	
	return false, "unknown"
}