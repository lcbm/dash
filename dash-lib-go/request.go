package main

import (
	"bytes"
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
)

func request(url string, data map[string]interface{}) {
	if postData, err := json.Marshal(data); err != nil {
		log.Fatal(err)
	} else if res, err := http.Post(url, "application/json", bytes.NewBuffer([]byte(postData))); err != nil {
		log.Fatal(err)
	} else if body, err := ioutil.ReadAll(res.Body); err != nil {
		log.Fatal(err)
	} else {
		res.Body.Close()
		log.Printf("HTTP Response: %s\n", body)
	}
}
