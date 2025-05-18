//go:build darwin
// +build darwin

package checks

import (
	"os/exec"
	"strings"
)

func checkAntivirus() (exists, active bool) {
	_, err := exec.LookPath("clamscan")
	if err != nil {
		return false, false
	}
}