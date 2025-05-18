//go:build darwin
// +build darwin

package checks

import (
	"os/exec"
	"strings"
)

func checkOSUpdate() bool {
	cmd := exec.Command("softwareupdate", "-l")
	out, err := cmd.Output()
	return err == nil && !strings.Contains(string(out), "No new software available")
}
	
