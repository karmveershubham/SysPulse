//go:build darwin
// +build darwin

package checks

import (
	"os/exec"
	"strings"
	"regexp"
)

func checkOSUpdate() (bool, string, string) {
	current := getCurrentMacOSVersion()
	latest := getLatestMacOSVersion()

	isUpToDate := current == latest
	return isUpToDate, current, latest
}

func getCurrentMacOSVersion() string {
	// Get macOS version using sw_vers
	cmd := exec.Command("sw_vers", "-productVersion")
	out, err := cmd.Output()
	if err == nil {
		version := strings.TrimSpace(string(out))
		
		// Get build number
		buildCmd := exec.Command("sw_vers", "-buildVersion")
		buildOut, buildErr := buildCmd.Output()
		if buildErr == nil {
			build := strings.TrimSpace(string(buildOut))
			return "macOS " + version + " (" + build + ")"
		}
		
		return "macOS " + version
	}
	
	// Fallback to system_profiler
	spCmd := exec.Command("system_profiler", "SPSoftwareDataType")
	spOut, spErr := spCmd.Output()
	if spErr == nil {
		re := regexp.MustCompile(`System Version: (macOS .*?)\n`)
		matches := re.FindStringSubmatch(string(spOut))
		if len(matches) > 1 {
			return matches[1]
		}
	}
	
	return "unknown"
}

func getLatestMacOSVersion() string {
	// Check for software updates
	updateCmd := exec.Command("softwareupdate", "-l")
	out, err := updateCmd.Output()
	if err == nil {
		outputStr := string(out)
		
		// If no updates are found
		if strings.Contains(outputStr, "No new software available") {
			return getCurrentMacOSVersion()
		}
		
		// Count system updates
		re := regexp.MustCompile(`(?m)^[\s*]*Label: (.*)$`)
		matches := re.FindAllStringSubmatch(outputStr, -1)
		
		// If system updates found
		if len(matches) > 0 {
			var osUpdates []string
			for _, match := range matches {
				if len(match) > 1 && (strings.Contains(match[1], "macOS") || 
				                      strings.Contains(match[1], "Security Update") ||
				                      strings.Contains(match[1], "Update") ||
				                      strings.Contains(match[1], "Supplemental")) {
					osUpdates = append(osUpdates, match[1])
				}
			}
			
			if len(osUpdates) > 0 {
				current := getCurrentMacOSVersion()
				return "Latest: " + current + " + " + strings.Join(osUpdates, ", ")
			}
		}
		
		// No OS updates
		return getCurrentMacOSVersion()
	}
	
	// If update check failed, fall back to a hardcoded latest known version
	// This should be updated regularly in production code
	latest := map[string]string{
		"10.15": "10.15.7",      // Catalina
		"11":    "11.7.10",      // Big Sur
		"12":    "12.7.2",       // Monterey
		"13":    "13.6.5",       // Ventura
		"14":    "14.5",         // Sonoma
	}
	
	current := getCurrentMacOSVersion()
	for prefix, version := range latest {
		if strings.Contains(current, prefix) {
			return "macOS " + version
		}
	}
	
	return current
}