//go:build linux
// +build linux

package checks

import (
	"os/exec"
	"strings"
	"bufio"
	"bytes"
)

func checkDiskEncryption() (bool, string) {
	// Check LUKS (Linux Unified Key Setup) encryption
	out, err := exec.Command("lsblk", "-f").Output()
	if err == nil {
		if strings.Contains(string(out), "crypto_LUKS") {
			return true, "LUKS"
		}
	}
	
	// Check if any devices are using dm-crypt
	dmsetupOut, err := exec.Command("dmsetup", "status").Output()
	if err == nil && len(dmsetupOut) > 0 {
		scanner := bufio.NewScanner(bytes.NewReader(dmsetupOut))
		for scanner.Scan() {
			line := scanner.Text()
			if strings.Contains(line, "crypt") {
				return true, "dm-crypt"
			}
		}
	}
	
	// Check for VeraCrypt
	veracryptOut, err := exec.Command("veracrypt", "--list").Output()
	if err == nil && len(veracryptOut) > 0 && !strings.Contains(string(veracryptOut), "No volumes mounted") {
		return true, "VeraCrypt"
	}

	// Check for eCryptfs
	mountOut, err := exec.Command("mount").Output()
	if err == nil {
		if strings.Contains(string(mountOut), "ecryptfs") {
			return true, "eCryptfs"
		}
	}

	// Check for ZFS encryption
	zfsOut, err := exec.Command("zfs", "get", "encryption").Output()
	if err == nil {
		if strings.Contains(string(zfsOut), "on") {
			return true, "ZFS Encryption"
		}
	}
	
	return false, "unknown"
}
