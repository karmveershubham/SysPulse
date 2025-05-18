//go:build linux
// +build linux

package checks

import (
    "os/exec"
    "strconv"
    "strings"
)

func checkSleepSettings() bool {
    cmd := exec.Command("gsettings", "get", "org.gnome.settings-daemon.plugins.power", "sleep-inactive-ac-timeout")
    out, err := cmd.Output()
    if err != nil {
        return false
    }

    val, _ := strconv.Atoi(strings.TrimSpace(string(out)))
    return val <= 600
}
