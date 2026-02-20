//go:build ignore

// gen.go generates responses_data.go from the canonical ../responses/*.json files.
// Run from the go/ directory with: go generate
package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strconv"
	"strings"
)

func main() {
	responsesDir := filepath.Join("..", "responses")

	entries, err := os.ReadDir(responsesDir)
	if err != nil {
		fmt.Fprintln(os.Stderr, "error reading responses dir:", err)
		os.Exit(1)
	}

	type pair struct {
		code     int
		messages []string
	}
	var pairs []pair

	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".json") {
			continue
		}
		code, err := strconv.Atoi(strings.TrimSuffix(entry.Name(), ".json"))
		if err != nil {
			continue
		}
		data, err := os.ReadFile(filepath.Join(responsesDir, entry.Name()))
		if err != nil {
			fmt.Fprintln(os.Stderr, "error reading", entry.Name(), ":", err)
			os.Exit(1)
		}
		var messages []string
		if err := json.Unmarshal(data, &messages); err != nil {
			fmt.Fprintln(os.Stderr, "error parsing", entry.Name(), ":", err)
			os.Exit(1)
		}
		if len(messages) > 0 {
			pairs = append(pairs, pair{code, messages})
		}
	}
	sort.Slice(pairs, func(i, j int) bool { return pairs[i].code < pairs[j].code })

	f, err := os.Create("responses_data.go")
	if err != nil {
		fmt.Fprintln(os.Stderr, "error creating output file:", err)
		os.Exit(1)
	}
	defer f.Close()

	fmt.Fprintln(f, "// Code generated from responses/*.json by go generate; DO NOT EDIT.")
	fmt.Fprintln(f)
	fmt.Fprintln(f, "package mockresponse")
	fmt.Fprintln(f)
	fmt.Fprintln(f, "var embeddedResponses = map[int][]string{")
	for _, p := range pairs {
		fmt.Fprintf(f, "\t%d: {\n", p.code)
		for _, msg := range p.messages {
			fmt.Fprintf(f, "\t\t%q,\n", msg)
		}
		fmt.Fprintln(f, "\t},")
	}
	fmt.Fprintln(f, "}")
}
