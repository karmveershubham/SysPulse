package main

import (
	"fmt"
	"sysutility/internal/checks"
	"time"
)

func main() {
	fmt.Println("Starting System Utility...")

	// cfg, err := config.LoadOrRegister()
	// if err != nil {
	//     fmt.Printf("❌ Registration failed: %v\n", err)
	//     return
	// }

	// for {
	//     report := checks.RunAllChecks()
	//     report.MachineID = cfg.MachineID
	//     report.Hostname = cfg.Hostname
	//     report.OS = cfg.OS

	//     if checks.HasChanged(report) {
	//         reporter.SendWithAuth(report, cfg.AuthToken)
	//     }

	//     time.Sleep(time.Duration(cfg.Interval) * time.Minute)
	// }

	for {
		report := checks.RunAllChecks()

		fmt.Printf("📝 System Report (%s):\n", time.Now().Format(time.RFC1123))
		fmt.Printf("🖥️  Machine ID:        %s\n", report.MachineID)
		fmt.Printf("🏷️  Hostname:          %s\n", report.Hostname)
		fmt.Printf("💻 OS:                %s\n", report.OS)

		fmt.Printf("🔐 Disk Encrypted:    %v\n", report.DiskEncrypted)
		fmt.Printf("🧰 Encryption Method: %s\n", report.DiskEncryptionMethod)

		fmt.Printf("⬆️  OS Up-To-Date:     %v\n", report.OSUpToDate)
		fmt.Printf("📦 Current Version:   %s\n", report.CurrentVersion)
		fmt.Printf("🌐 Latest Version:    %s\n", report.LatestVersion)

		fmt.Printf("🛡️  Antivirus Exists:  %v\n", report.AntivirusExists)
		fmt.Printf("✅ Antivirus Active:  %v\n", report.AntivirusActive)
		fmt.Printf("🔎 Antivirus Name:    %s\n", report.AntivirusName)

		fmt.Printf("💤 Sleep Timeout ≤10m: %v\n", report.SleepOK)

		fmt.Println("⏱️  Waiting 30 minutes for next check...")

		time.Sleep(30 * time.Minute) // Use 1 * time.Minute for testing
	}

}
