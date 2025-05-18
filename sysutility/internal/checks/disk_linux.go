//go:build linux
// +build linux

package checks

import (
    "os/exec"
    "strings"
)

func checkDiskEncryption() bool {
    out, err := exec.Command("lsblk", "-o", "NAME,TYPE,MOUNTPOINT").Output()
    return err == nil && strings.Contains(string(out), "crypt")
}
