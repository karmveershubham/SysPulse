package config

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io/ioutil"
    "net/http"
    "os"
    "path/filepath"
    "runtime"
    "sysutility/utils"
)

type Config struct {
    MachineID string `json:"machine_id"`
    OS        string `json:"os"`
    Hostname  string `json:"hostname"`
    Interval  int    `json:"interval"`
    AuthToken string `json:"token"`
}

const configPath = "~/.sysutility/config.json"
const serverRegisterURL = "https://your-api.com/register" // Replace with your actual endpoint

func expandPath(path string) string {
    if len(path) >= 2 && path[:2] == "~/" {
        home, _ := os.UserHomeDir()
        return filepath.Join(home, path[2:])
    }
    return path
}

func LoadOrRegister() (*Config, error) {
    path := expandPath(configPath)

    // Load if exists
    if _, err := os.Stat(path); err == nil {
        data, _ := ioutil.ReadFile(path)
        var cfg Config
        json.Unmarshal(data, &cfg)
        return &cfg, nil
    }

    // Register
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
    json.NewDecoder(resp.Body).Decode(&response)
    cfg.AuthToken = response["token"]

    os.MkdirAll(filepath.Dir(path), 0755)
    data, _ := json.MarshalIndent(cfg, "", "  ")
    ioutil.WriteFile(path, data, 0644)

    return &cfg, nil
}
