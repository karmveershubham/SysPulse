//go:build darwin
// +build darwin

package checks

import (
	"os/exec"
	"regexp"
	"strconv"
	"strings"
)

func checkSleepSettings() bool {
	// Method 1: Check display sleep settings
	displaySleepCmd := exec.Command("pmset", "-g")
	out, err := displaySleepCmd.Output()
	if err == nil {
		outputStr := string(out)

		// Check for displaysleep setting
		displayRe := regexp.MustCompile(`displaysleep\s+(\d+)`)
		displayMatches := displayRe.FindStringSubmatch(outputStr)

		if len(displayMatches) > 1 {
			if val, err := strconv.ParseInt(displayMatches[1], 10, 64); err == nil {
				if val <= 10 { // 10 minutes or less
					return true
				}
			}
		}

		// Also check for sleep setting (system sleep)
		sleepRe := regexp.MustCompile(`sleep\s+(\d+)`)
		sleepMatches := sleepRe.FindStringSubmatch(outputStr)

		if len(sleepMatches) > 1 {
			if val, err := strconv.ParseInt(sleepMatches[1], 10, 64); err == nil {
				if val <= 10 { // 10 minutes or less
					return true
				}
			}
		}
	}

	// Method 2: Check with defaults command for Energy Saver preferences
	defaultsCmd := exec.Command("defaults", "-currentHost", "read", "com.apple.screensaver", "idleTime")
	out, err = defaultsCmd.Output()
	if err == nil {
		timeStr := strings.TrimSpace(string(out))
		if val, err := strconv.ParseInt(timeStr, 10, 64); err == nil {
			return val <= 600 // Value is in seconds, so 600 = 10 minutes
		}
	}

	// Method 3: Alternative defaults check
	energyCmd := exec.Command("defaults", "-currentHost", "read", "com.apple.PowerManagement")
	out, err = energyCmd.Output()
	if err == nil {
		outputStr := string(out)

		// Check for "Display Sleep Timer" or "System Sleep Timer"
		displayRe := regexp.MustCompile(`"Display Sleep Timer" = (\d+)`)
		displayMatches := displayRe.FindStringSubmatch(outputStr)

		if len(displayMatches) > 1 {
			if val, err := strconv.ParseInt(displayMatches[1], 10, 64); err == nil {
				return val <= 10 // Value is in minutes
			}
		}

		systemRe := regexp.MustCompile(`"System Sleep Timer" = (\d+)`)
		systemMatches := systemRe.FindStringSubmatch(outputStr)

		if len(systemMatches) > 1 {
			if val, err := strconv.ParseInt(systemMatches[1], 10, 64); err == nil {
				return val <= 10 // Value is in minutes
			}
		}
	}

	return false // Default to false if no sleep settings found
}
