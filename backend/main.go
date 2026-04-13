package main

import (
    "log"
    "net/http"

    gen "EcoPlatform/backend/api/gen"
    "EcoPlatform/backend/handlers"
)

func main() {
    h := handlers.New()

    router, err := gen.NewServer(h)
    if err != nil {
        log.Fatal("router: %v", err)
    }

    log.Println("EcoPlatform API running on :8080")
    http.ListenAndServe(":8080", router)
}