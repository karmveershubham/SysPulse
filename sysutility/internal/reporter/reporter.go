package reporter

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"sysutility/internal/checks"
)

var reportURL = "http://localhost:5000/api/systems/report"

func SendWithAuth(report checks.SystemReport, token string) {

	body, err := json.Marshal(report)
	if err != nil {
		fmt.Println("Error marshaling report:", err)
		return
	}

	req, err := http.NewRequest("POST", reportURL, bytes.NewBuffer(body))
	if err != nil {
		fmt.Println("Error creating request:", err)
		return
	}
	req.Header.Set("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Error sending request:", err)
		return
	}
	defer resp.Body.Close()

	fmt.Println("Response Status:", resp.Status)

	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		fmt.Println("Server returned non-success status:", resp.StatusCode)
	}
}
