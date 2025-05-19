package checks

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

func HasChangedFrom(oldReport, newReport SystemReport) bool {
	return oldReport.DiskEncrypted != newReport.DiskEncrypted ||
		oldReport.OSUpToDate != newReport.OSUpToDate ||
		oldReport.CurrentVersion != newReport.CurrentVersion ||
		oldReport.LatestVersion != newReport.LatestVersion ||
		oldReport.AntivirusExists != newReport.AntivirusExists ||
		oldReport.AntivirusActive != newReport.AntivirusActive ||
		oldReport.AntivirusName != newReport.AntivirusName ||
		oldReport.SleepOK != newReport.SleepOK
}
