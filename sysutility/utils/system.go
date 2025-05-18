package utils

import (
    "fmt"
    "os"
)

func GenerateMachineID() string {
    hostname, _ := os.Hostname()
    return fmt.Sprintf("%s-%d", hostname, os.Getpid())
}
