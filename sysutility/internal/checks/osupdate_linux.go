//go:build linux
// +build linux

package checks

import (
	"os/exec"
	"strings"
	"bufio"
	"regexp"
	"bytes"
)

func checkOSUpdate() (bool, string, string) {
	current := getCurrentLinuxVersion()
	latest := getLatestLinuxVersion()

	isUpToDate := current == latest
	return isUpToDate, current, latest
}

func getCurrentLinuxVersion() string {
	// Try multiple methods to get the current version
	
	// Method 1: Check /etc/os-release
	catCmd := exec.Command("cat", "/etc/os-release")
	out, err := catCmd.Output()
	if err == nil {
		scanner := bufio.NewScanner(bytes.NewReader(out))
		var version, name string
		for scanner.Scan() {
			line := scanner.Text()
			if strings.HasPrefix(line, "VERSION_ID=") {
				version = strings.Trim(strings.TrimPrefix(line, "VERSION_ID="), "\"")
			} else if strings.HasPrefix(line, "NAME=") {
				name = strings.Trim(strings.TrimPrefix(line, "NAME="), "\"")
			}
		}
		if name != "" && version != "" {
			return name + " " + version
		}
	}
	
	// Method 2: Check specific distribution files
	// Ubuntu/Debian
	lsbCmd := exec.Command("lsb_release", "-ds")
	out, err = lsbCmd.Output()
	if err == nil {
		return strings.TrimSpace(string(out))
	}
	
	// CentOS/RHEL
	catCmd = exec.Command("cat", "/etc/redhat-release")
	out, err = catCmd.Output()
	if err == nil {
		return strings.TrimSpace(string(out))
	}
	
	// Method 3: Use uname as fallback
	unameCmd := exec.Command("uname", "-r")
	out, err = unameCmd.Output()
	if err == nil {
		return "Linux kernel " + strings.TrimSpace(string(out))
	}
	
	return "unknown"
}

func getLatestLinuxVersion() string {
	// Check for available updates based on distribution
	
	// Ubuntu/Debian: apt-get update and upgrade -s
	aptCmd := exec.Command("sh", "-c", "apt-get update -qq && apt-get upgrade -s")
	out, err := aptCmd.Output()
	if err == nil {
		// Count number of lines with "Inst"
		re := regexp.MustCompile(`(?m)^Inst`)
		matches := re.FindAllStringIndex(string(out), -1)
		if len(matches) == 0 {
			// No updates available, current version is latest
			return getCurrentLinuxVersion()
		} else {
			// Updates available, return count of updates
			return getCurrentLinuxVersion() + " (Updates available: " + string(rune(len(matches))) + ")"
		}
	}
	
	// RHEL/CentOS: yum check-update
	yumCmd := exec.Command("yum", "check-update", "--quiet")
	err = yumCmd.Run()
	// yum returns exit code 100 if updates available
	if err != nil && yumCmd.ProcessState.ExitCode() == 100 {
		// Updates available
		return getCurrentLinuxVersion() + " (Updates available)"
	} else if err == nil {
		// No updates
		return getCurrentLinuxVersion()
	}
	
	// Fedora/newer RHEL: dnf check-update
	dnfCmd := exec.Command("dnf", "check-update", "--quiet")
	err = dnfCmd.Run()
	if err != nil && dnfCmd.ProcessState.ExitCode() == 100 {
		// Updates available
		return getCurrentLinuxVersion() + " (Updates available)"
	} else if err == nil {
		// No updates
		return getCurrentLinuxVersion()
	}
	
	// Arch Linux: pacman -Syu --dry-run
	pacmanCmd := exec.Command("sh", "-c", "pacman -Qu | wc -l")
	out, err = pacmanCmd.Output()
	if err == nil {
		count := strings.TrimSpace(string(out))
		if count == "0" {
			return getCurrentLinuxVersion()
		} else {
			return getCurrentLinuxVersion() + " (Updates available: " + count + ")"
		}
	}
	
	// If all update checks fail, return current version
	return getCurrentLinuxVersion()
}