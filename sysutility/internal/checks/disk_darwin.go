//go:build darwin
// +build darwin

package checks

import (
	"os/exec"
	"strings"
)

func checkDiskEncryption() bool {
	out, err := exec.Command("diskutil", "list").Output()
	return err == nil && strings.Contains(string(out), "Apple_APFS")
}
