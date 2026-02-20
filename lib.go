// Package mockresponse provides sarcastic HTTP status responses for testing and development.
// It mirrors the behaviour of the @mockeroo/mock-responses npm package.
//
// Usage:
//
//	import mockresponse "github.com/mockeroo/mock-response/go"
//
//	resp := mockresponse.GetResponse(404)
//	if resp != nil {
//	    fmt.Println(resp.Status, resp.Message)
//	}
package mockresponse

import (
	"embed"
	"encoding/json"
	"math/rand"
	"sort"
	"strconv"
	"strings"
)

//go:embed responses/*.json
var responseFiles embed.FS

// Response holds an HTTP status code and a randomly chosen sarcastic message.
type Response struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
}

var (
	responses      map[int][]string
	availableCodes []int
)

func init() {
	responses = make(map[int][]string)

	entries, err := responseFiles.ReadDir("responses")
	if err != nil {
		return
	}

	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".json") {
			continue
		}

		codeStr := strings.TrimSuffix(entry.Name(), ".json")
		code, err := strconv.Atoi(codeStr)
		if err != nil {
			continue
		}

		data, err := responseFiles.ReadFile("responses/" + entry.Name())
		if err != nil {
			continue
		}

		var messages []string
		if err := json.Unmarshal(data, &messages); err != nil || len(messages) == 0 {
			continue
		}

		responses[code] = messages
	}

	for code := range responses {
		availableCodes = append(availableCodes, code)
	}
	sort.Ints(availableCodes)
}

// GetResponse returns a Response with a random sarcastic message for the given HTTP
// status code, or nil if the code is not recognised.
func GetResponse(statusCode int) *Response {
	messages, ok := responses[statusCode]
	if !ok {
		return nil
	}
	return &Response{
		Status:  statusCode,
		Message: messages[rand.Intn(len(messages))],
	}
}

// GetAvailableCodes returns all supported HTTP status codes in ascending order.
// Each call returns a new slice so callers may modify it freely.
func GetAvailableCodes() []int {
	result := make([]int, len(availableCodes))
	copy(result, availableCodes)
	return result
}
