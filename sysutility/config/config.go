package config

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"runtime"
	"sysutility/internal/checks"
	"sysutility/utils"
)

type Config struct {
	MachineID string               `json:"machine_id"`
	OS        string               `json:"os"`
	Hostname  string               `json:"hostname"`
	Interval  int                  `json:"interval"`
	AuthToken string               `json:"token"`
	Report    *checks.SystemReport `json:"report,omitempty"`
}

var (
	configDir         = filepath.Join(getHomeDir(), ".sysutility")
	configPath        = filepath.Join(configDir, "config.json")
	serverRegisterURL = "http://localhost:5000/api/systems/register"
)

func getHomeDir() string {
	home, err := os.UserHomeDir()
	if err != nil {
		fmt.Println("Error getting home directory:", err)
		os.Exit(1)
	}
	return home
}

func GetConfigPath() string {
	return configPath
}

func MarshalConfig(cfg *Config) ([]byte, error) {
	return json.MarshalIndent(cfg, "", "  ")
}

func saveConfigToDisk(cfg *Config) error {
	data, err := MarshalConfig(cfg)
	if err != nil {
		return err
	}
	return os.WriteFile(configPath, data, 0644)
}

func LoadOrRegister() (*Config, error) {
	if _, err := os.Stat(configPath); err == nil {
		// Load existing config
		data, err := os.ReadFile(configPath)
		if err != nil {
			return nil, fmt.Errorf("error reading config: %v", err)
		}
		var cfg Config
		if err := json.Unmarshal(data, &cfg); err != nil {
			return nil, fmt.Errorf("invalid config format: %v", err)
		}
		return &cfg, nil
	}

	// Register if config doesn't exist
	machineID := utils.GenerateMachineID()
	hostname, _ := os.Hostname()

	cfg := Config{
		MachineID: machineID,
		Hostname:  hostname,
		OS:        runtime.GOOS,
		Interval:  30,
	}

	payload, _ := json.Marshal(cfg)
	resp, err := http.Post(serverRegisterURL, "application/json", bytes.NewBuffer(payload))
	if err != nil {
		return nil, fmt.Errorf("failed to register: %v", err)
	}
	defer resp.Body.Close()

	var response map[string]string
	if err := json.NewDecoder(resp.Body).Decode(&response); err != nil {
		return nil, fmt.Errorf("invalid response: %v", err)
	}

	token, ok := response["token"]
	if !ok || token == "" {
		return nil, fmt.Errorf("registration failed: token missing")
	}
	cfg.AuthToken = token

	// Generate and assign first report
	report := checks.RunAllChecks()
	report.MachineID = cfg.MachineID
	report.Hostname = cfg.Hostname
	report.OS = cfg.OS
	cfg.Report = &report

	// Save config
	if err := os.MkdirAll(configDir, 0755); err != nil {
		return nil, fmt.Errorf("failed to create config directory: %v", err)
	}
	if err := saveConfigToDisk(&cfg); err != nil {
		return nil, err
	}

	return &cfg, nil
}

func UpdateReport(cfg *Config, newReport checks.SystemReport) error {
	cfg.Report = &newReport
	return saveConfigToDisk(cfg)
}
