//go:build linux
// +build linux

package checks

import (
	"os/exec"
	"strconv"
	"strings"
	"bufio"
	"bytes"
	"io/ioutil"
	"path/filepath"
)

func checkSleepSettings() bool {
	// Method 1: Check systemd settings (for modern Linux distros)
	out, err := exec.Command("systemctl", "show", "-p", "IdleAction", "sleep.target").Output()
	if err == nil {
		output := string(out)
		if strings.Contains(output, "IdleAction=") {
			// Found systemd idle action setting
			parts := strings.SplitN(output, "=", 2)
			if len(parts) == 2 && parts[1] != "ignore" && parts[1] != "" {
				// There is a sleep action configured

				// Now check the timeout
				timeOut, err := exec.Command("systemctl", "show", "-p", "IdleActionSec", "sleep.target").Output()
				if err == nil {
					timeStr := string(timeOut)
					parts := strings.SplitN(timeStr, "=", 2)
					if len(parts) == 2 {
						// Try to parse the timeout value (might be in format like "30min")
						timeStr = strings.TrimSpace(parts[1])
						timeStr = strings.ReplaceAll(timeStr, "min", "")
						timeStr = strings.ReplaceAll(timeStr, "s", "")
						
						if secs, err := strconv.ParseInt(timeStr, 10, 64); err == nil {
							return secs <= 600 // 10 minutes or less
						}
					}
				}
			}
		}
	}
	
	// Method 2: Check for gsettings in GNOME
	out, err = exec.Command("gsettings", "get", "org.gnome.settings-daemon.plugins.power", "sleep-inactive-ac-timeout").Output()
	if err == nil {
		timeStr := strings.TrimSpace(string(out))
		if timeVal, err := strconv.ParseInt(timeStr, 10, 64); err == nil {
			return timeVal <= 600 // 10 minutes or less
		}
	}
	
	// Method 3: Check xfce power manager settings
	xfceConfig := filepath.Join(getHomeDir(), ".config", "xfce4", "xfconf", "xfce-perchannel-xml", "xfce4-power-manager.xml")
	if data, err := ioutil.ReadFile(xfceConfig); err == nil {
		content := string(data)
		if strings.Contains(content, "inactivity-sleep-mode-ac") && strings.Contains(content, "inactivity-on-ac") {
			// Extract the timeout value
			scanner := bufio.NewScanner(bytes.NewReader(data))
			sleepEnabled := false
			var timeoutVal int64 = 0
			
			for scanner.Scan() {
				line := scanner.Text()
				if strings.Contains(line, "inactivity-sleep-mode-ac") && strings.Contains(line, "value=\"1\"") {
					sleepEnabled = true
				}
				if strings.Contains(line, "inactivity-on-ac") {
					parts := strings.Split(line, "value=\"")
					if len(parts) > 1 {
						valParts := strings.Split(parts[1], "\"")
						if len(valParts) > 0 {
							if val, err := strconv.ParseInt(valParts[0], 10, 64); err == nil {
								timeoutVal = val
							}
						}
					}
				}
			}
			
			if sleepEnabled && timeoutVal > 0 {
				return timeoutVal <= 10 // XFCE uses minutes, so 10 = 10 minutes
			}
		}
	}
	
	// Method 4: Check KDE settings
	kdeConfig := filepath.Join(getHomeDir(), ".config", "powermanagementprofilesrc")
	if data, err := ioutil.ReadFile(kdeConfig); err == nil {
		scanner := bufio.NewScanner(bytes.NewReader(data))
		inACSection := false
		
		for scanner.Scan() {
			line := scanner.Text()
			if strings.Contains(line, "[AC]") {
				inACSection = true
				continue
			}
			if inACSection && strings.HasPrefix(line, "[") {
				// Left the AC section
				inACSection = false
			}
			if inACSection && strings.HasPrefix(line, "SuspendSession=") {
				parts := strings.SplitN(line, "=", 2)
				if len(parts) == 2 {
					if timeVal, err := strconv.ParseInt(parts[1], 10, 64); err == nil {
						return timeVal <= 10 // KDE also uses minutes
					}
				}
			}
		}
	}

	return false // Default to false if no sleep settings found
}

func getHomeDir() string {
	out, err := exec.Command("sh", "-c", "echo $HOME").Output()
	if err == nil {
		return strings.TrimSpace(string(out))
	}
	return "/home/" // fallback
}
