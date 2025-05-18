//go:build darwin
// +build darwin

package checks

import (
	"os/exec"
	"strings"
)

func checkSleepSettings() bool {
	cmd := exec.Command("pmset sleep")
	out, err := cmd.Output()
	return err == nil && strings.Contains(string(out), "sleep")
}
