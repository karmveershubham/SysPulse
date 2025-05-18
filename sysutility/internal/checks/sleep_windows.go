//go:build windows
// +build windows

package checks

import (
    "os/exec"
    "strconv"
    "strings"
)

func checkSleepSettings() bool {
    cmd := `powercfg -query SCHEME_CURRENT SUB_SLEEP STANDBYIDLE`
    out, err := exec.Command("powershell", "-Command", cmd).Output()
    if err != nil {
        return false
    }

    str := string(out)
    idx := strings.Index(str, "Current AC Power Setting Index")
    if idx == -1 {
        return false
    }

    line := str[idx:]
    fields := strings.Fields(line)
    if len(fields) < 7 {
        return false
    }

    valHex := fields[6]
    val, err := strconv.ParseInt(valHex, 16, 64)
    if err != nil {
        return false
    }

    return val <= 600 // seconds
}
