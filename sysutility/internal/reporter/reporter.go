package reporter

import (
    "bytes"
    "encoding/json"
    "net/http"
    "sysutility/internal/checks"
)

const reportURL = "https://your-api.com/report"

func SendWithAuth(report checks.SystemReport, token string) {
    body, _ := json.Marshal(report)
    req, _ := http.NewRequest("POST", reportURL, bytes.NewBuffer(body))
    req.Header.Set("Authorization", "Bearer "+token)
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    client.Do(req)
}
