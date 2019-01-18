package main

import (
	"encoding/json"
	"log"
	"os"
)

type Button struct {
	Owner string                 `json:"owner"`
	Mac   string                 `json:"mac"`
	URL   string                 `json:"url"`
	Data  map[string]interface{} `json:"data"`
}

type Configuration struct {
	Buttons []Button `json:"buttons"`
	Iface   string   `json:"iface"`
}

func loadConfig() Configuration {
	config := Configuration{}

	if file, err := os.Open("config.json"); err != nil {
		log.Fatal(err)
	} else if decoder := json.NewDecoder(file); err != nil {
		log.Fatal(err)
	} else if err := decoder.Decode(&config); err != nil {
		log.Fatal(err)
	}

	return config
}
