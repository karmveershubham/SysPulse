//go:build darwin
// +build darwin

package checks

import (
	"os"
	"os/exec"
	"path/filepath"
	"strings"
)

func checkAntivirus() (bool, bool, string) {
	// Common macOS antivirus application locations
	avLocations := []struct {
		path string
		name string
	}{
		{"/Applications/Sophos Antivirus.app", "Sophos"},
		{"/Applications/Avast Security.app", "Avast"},
		{"/Applications/AVG AntiVirus.app", "AVG"},
		{"/Applications/Bitdefender.app", "Bitdefender"},
		{"/Applications/ESET Cyber Security.app", "ESET"},
		{"/Applications/Norton Security.app", "Norton"},
		{"/Applications/Kaspersky.app", "Kaspersky"},
		{"/Applications/McAfee Anti-Virus.app", "McAfee"},
		{"/Applications/ClamAV.app", "ClamAV"},
		{"/Applications/Trend Micro Security.app", "Trend Micro"},
		{"/Applications/Malwarebytes.app", "Malwarebytes"},
	}

	// Check if any antivirus application is installed
	for _, av := range avLocations {
		if _, err := os.Stat(av.path); err == nil {
			// Check if the application is running
			cmd := exec.Command("pgrep", "-f", av.name)
			if err := cmd.Run(); err == nil {
				return true, true, av.name
			}
			// Application exists but not running
			return true, false, av.name
		}
	}

	// Check if any known antivirus process is running via launchctl
	cmd := exec.Command("launchctl", "list")
	output, err := cmd.Output()
	if err == nil {
		outputStr := string(output)
		avServices := []string{
			"com.sophos", "com.avast", "com.avg", "com.bitdefender",
			"com.eset", "com.symantec", "com.norton", "com.kaspersky",
			"com.mcafee", "org.clamav", "com.trendmicro", "com.malwarebytes",
		}

		for _, avService := range avServices {
			if strings.Contains(outputStr, avService) {
				// Extract the name from the service identifier
				name := strings.TrimPrefix(avService, "com.")
				name = strings.TrimPrefix(name, "org.")
				// Capitalize first letter
				if len(name) > 0 {
					name = strings.ToUpper(name[:1]) + name[1:]
				}
				return true, true, name
			}
		}
	}

	// Check for XProtect and built-in macOS security
	xprotectPath := "/System/Library/CoreServices/XProtect.bundle"
	if _, err := os.Stat(xprotectPath); err == nil {
		// Check if XProtect definitions are recent (by checking if the directory has contents)
		files, err := filepath.Glob(filepath.Join(xprotectPath, "Contents/Resources/*"))
		if err == nil && len(files) > 0 {
			return true, true, "XProtect (macOS built-in)"
		}
	}

	return false, false, ""
}
