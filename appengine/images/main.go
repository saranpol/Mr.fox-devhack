package main

import (
	"encoding/json"
	"fmt"
	"html"
	"log"
	"net/http"
	"os"
	"runtime/debug"
	"strings"

	"google.golang.org/appengine"
	"google.golang.org/appengine/blobstore"
	"google.golang.org/appengine/image"
)

func main() {
	appengine.Main()
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
		log.Printf("Defaulting to port %s", port)
	}
	log.Printf("Listening on port %s", port)
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%s", port), nil))
}

func init() {
	http.HandleFunc("/", index)
	http.HandleFunc("/image_url_get", image_url_get)
}


func index(w http.ResponseWriter, r *http.Request) {
	urlPath := html.EscapeString(r.URL.Path)
	if urlPath == "/" {
		info := make(map[string]string)
		info["Title"] = "Test"
		printJson(w, info)
		return
	}
}

func enableCors(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
}

// http://localhost:8080/image_url_get?storage_location=gs://pm-ecom.appspot.com/test/test.png
// https://images-dot-srisiam.appspot.com/image_url_get?storage_location=gs://srisiam.appspot.com/test/logo-social-share.jpg

func image_url_get(w http.ResponseWriter, r *http.Request) {
	enableCors(&w)
	c := appengine.NewContext(r)
	storage_location := r.FormValue("storage_location")
	storage_location = strings.Replace(storage_location, "gs://", "/gs/", -1)
	blobKey, err := blobstore.BlobKeyForFile(c, storage_location)
	if EEE(w, err) {
		return
	}
	imgURL, err := image.ServingURL(c, blobKey, nil)
	if EEE(w, err) {
		return
	}

	info := make(map[string]string)
	info["image_url"] = strings.Replace(imgURL.String(), "http://", "https://", -1)
	printJson(w, info)
}

func getJsonString(v interface{}) string {
	b, err := json.Marshal(v)
	CheckErr(err)
	return string(b)
}

func printJson(w http.ResponseWriter, v interface{}) {
	fmt.Fprint(w, getJsonString(v))
}

func CheckErr(err error) {
	if err != nil {
		panic(err)
	}
}

func EEE(w http.ResponseWriter, err error) bool {
	if err == nil {
		return false
	}
	var j J
	j.Success = 0
	j.Reason = err.Error()
	printJson(w, j)
	debug.PrintStack()
	return true
}

type J struct {
	Success int    `json:"success"`
	Reason  string `json:"reason"`
}
