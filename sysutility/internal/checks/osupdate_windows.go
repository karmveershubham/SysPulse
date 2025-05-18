//go:build windows
// +build windows

package checks

import (
	"os/exec"
	"strings"
)

func checkOSUpdate() (bool, string, string) {
	current := getCurrentWindowsVersion()
	latest := getLatestWindowsVersion() // hardcoded or scrape Microsoft API (advanced)

	isUpToDate := current == latest
	return isUpToDate, current, latest
}

func getCurrentWindowsVersion() string {
	cmd := exec.Command("cmd", "/C", "ver")
	out, _ := cmd.Output()
	return strings.TrimSpace(string(out))
}

func getLatestWindowsVersion() string {
	// For now, return hardcoded known latest version
	return "10.0.19045.4291"
}
