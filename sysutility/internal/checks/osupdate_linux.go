//go:build linux
// +build linux

package checks

import (
    "os/exec"
    "strings"
)

func checkOSUpdate() bool {
    cmd := exec.Command("apt", "list", "--upgradable")
    out, err := cmd.Output()
    return err == nil && !strings.Contains(string(out), "upgradable")
}
