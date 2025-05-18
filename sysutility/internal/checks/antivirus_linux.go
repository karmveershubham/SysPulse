//go:build linux
// +build linux

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
    out, err := exec.Command("systemctl", "is-active", "clamav-daemon").Output()
    return true, err == nil && strings.Contains(string(out), "active")
}
