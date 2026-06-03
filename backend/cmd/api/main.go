package main

import (
	"backend/internal/config"
	"backend/internal/infrastructure/websocket"
	"log"
)

func main() {
	// SOON TO BE IMPLEMENTED
	// cfg := config.LoadConfig()

	db := config.ConnectDB()
	defer func() {
		sqlDB, _ := db.DB()
		sqlDB.Close()
	}()

	deps, err := config.NewDependencies(db)
	if err != nil {
		log.Fatalf("Failed to initialize dependencies: %v", err)
	}

	go deps.WebSocketHub.Run()
	go deps.CasinoService.Game.Start()
	deps.WebSocketHandler.Connect(func(client *websocket.Client) {
		deps.CasinoService.Game.SendCurrentGameState(client)
	})

	srv, err := config.SetupServer(deps)
	if err != nil {
		log.Fatalf("Failed to setup server: %v", err)
	}

	log.Printf("Listening on port %v", srv.Addr)
	log.Printf("Websocket Point available on /ws")
	log.Fatal(srv.ListenAndServe())
}
