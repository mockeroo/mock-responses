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
//
// Response data is generated from responses/*.json via go generate.
//
//go:generate go run gen.go
package mockresponse

import (
	"math/rand"
	"sort"
)

// Response holds an HTTP status code and a randomly chosen sarcastic message.
type Response struct {
	Status  int    `json:"status"`
	Message string `json:"message"`
}

var availableCodes []int

func init() {
	for code := range embeddedResponses {
		availableCodes = append(availableCodes, code)
	}
	sort.Ints(availableCodes)
}

// GetResponse returns a Response with a random sarcastic message for the given HTTP
// status code, or nil if the code is not recognised.
func GetResponse(statusCode int) *Response {
	messages, ok := embeddedResponses[statusCode]
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
