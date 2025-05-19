package main

import (
	"fmt"
	"os"
	"sysutility/config"
	"sysutility/internal/checks"
	"sysutility/internal/reporter"
	"time"
)

func main() {
	fmt.Println("Starting System Utility...")

	cfg, err := config.LoadOrRegister()
	if err != nil {
		fmt.Printf("Error during load/register: %v\n", err)
		return
	}

	if cfg.Report != nil {
		fmt.Println("Sending Report")
		reporter.SendWithAuth(*cfg.Report, cfg.AuthToken)
	}

	for {
		fmt.Println("Performing system check...")

		currentReport := checks.RunAllChecks()
		currentReport.MachineID = cfg.MachineID
		currentReport.Hostname = cfg.Hostname
		currentReport.OS = cfg.OS

		if cfg.Report == nil || checks.HasChangedFrom(*cfg.Report, currentReport) {
			fmt.Println("Change detected in system report. Sending update...")

			reporter.SendWithAuth(currentReport, cfg.AuthToken)

			// Save updated report to config file
			if err := config.UpdateReport(cfg, currentReport); err != nil {
				fmt.Fprintf(os.Stderr, "Failed to update config with new report: %v\n", err)
			}
		} else {
			fmt.Println("No change in system report.")
		}

		time.Sleep(time.Duration(cfg.Interval) * time.Minute)
	}
}
