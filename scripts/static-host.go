package main

import (
	"flag"
	"net/http"
)

func main() {
	dirPath := flag.String("dir", "./src", "directory path to use")
	flag.Parse()

	http.Handle("/", http.FileServer(http.Dir(*dirPath)))
	http.ListenAndServe(":3000", nil)
}
