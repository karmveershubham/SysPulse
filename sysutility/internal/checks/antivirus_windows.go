//go:build windows
// +build windows

package checks

import (
	"os/exec"
	"strings"
)

func checkAntivirus() (bool, bool, string) {
	out, err := exec.Command("powershell", "Get-CimInstance -Namespace root/SecurityCenter2 -ClassName AntivirusProduct").Output()
	if err != nil {
		return false, false, "unknown"
	}

	output := string(out)
	if strings.TrimSpace(output) == "" {
		return false, false, ""
	}

	active := strings.Contains(output, "productState") && !strings.Contains(output, "0")
	name := parseAntivirusName(output)

	return true, active, name
}

func parseAntivirusName(raw string) string {
	lines := strings.Split(raw, "\n")
	for _, line := range lines {
		if strings.Contains(line, "displayName") {
			return strings.TrimSpace(strings.Split(line, ":")[1])
		}
	}
	return "unknown"
}
