package checks

var lastReport *SystemReport

func RunAllChecks() SystemReport {
	diskEncrypted, method := checkDiskEncryption()
	osUpToDate, current, latest := checkOSUpdate()
	avExists, avActive, avName := checkAntivirus()
	sleep := checkSleepSettings()

	return SystemReport{
		DiskEncrypted:        diskEncrypted,
		DiskEncryptionMethod: method,
		OSUpToDate:           osUpToDate,
		CurrentVersion:       current,
		LatestVersion:        latest,
		AntivirusExists:      avExists,
		AntivirusActive:      avActive,
		AntivirusName:        avName,
		SleepOK:              sleep,
	}
}

func HasChanged(newReport SystemReport) bool {
	if lastReport == nil {
		lastReport = &newReport
		return true
	}

	changed := *lastReport != newReport
	if changed {
		lastReport = &newReport
	}
	return changed
}
