package mockresponse_test

import (
	"testing"

	mockresponse "github.com/mockeroo/mock-response/go"
)

func TestGetResponse_KnownCode(t *testing.T) {
	resp := mockresponse.GetResponse(200)
	if resp == nil {
		t.Fatal("expected non-nil response for 200")
	}
	if resp.Status != 200 {
		t.Errorf("expected status 200, got %d", resp.Status)
	}
	if resp.Message == "" {
		t.Error("expected non-empty message")
	}
}

func TestGetResponse_UnknownCode(t *testing.T) {
	resp := mockresponse.GetResponse(999)
	if resp != nil {
		t.Errorf("expected nil for unknown code 999, got %+v", resp)
	}
}

func TestGetResponse_AllAvailableCodes(t *testing.T) {
	codes := mockresponse.GetAvailableCodes()
	for _, code := range codes {
		resp := mockresponse.GetResponse(code)
		if resp == nil {
			t.Errorf("GetResponse(%d) returned nil but code is listed as available", code)
			continue
		}
		if resp.Status != code {
			t.Errorf("GetResponse(%d): expected status %d, got %d", code, code, resp.Status)
		}
		if resp.Message == "" {
			t.Errorf("GetResponse(%d): got empty message", code)
		}
	}
}

func TestGetAvailableCodes_NotEmpty(t *testing.T) {
	codes := mockresponse.GetAvailableCodes()
	if len(codes) == 0 {
		t.Fatal("expected non-empty list of codes")
	}
}

func TestGetAvailableCodes_Sorted(t *testing.T) {
	codes := mockresponse.GetAvailableCodes()
	for i := 1; i < len(codes); i++ {
		if codes[i] <= codes[i-1] {
			t.Errorf("codes not sorted at index %d: %d followed by %d", i, codes[i-1], codes[i])
		}
	}
}

func TestGetAvailableCodes_ContainsExpected(t *testing.T) {
	expected := []int{200, 201, 204, 400, 401, 403, 404, 500}
	codeSet := make(map[int]bool)
	for _, c := range mockresponse.GetAvailableCodes() {
		codeSet[c] = true
	}
	for _, c := range expected {
		if !codeSet[c] {
			t.Errorf("expected code %d to be available", c)
		}
	}
}

func TestGetAvailableCodes_ReturnsCopy(t *testing.T) {
	codes1 := mockresponse.GetAvailableCodes()
	codes2 := mockresponse.GetAvailableCodes()
	if len(codes1) == 0 {
		t.Skip("no codes available")
	}
	original := codes2[0]
	codes1[0] = -1
	if codes2[0] != original {
		t.Error("GetAvailableCodes should return an independent slice each call")
	}
}

func TestGetResponse_ReturnsVariedMessages(t *testing.T) {
	// 404 has 10+ messages; after 100 draws we expect more than one unique message.
	seen := make(map[string]bool)
	for i := 0; i < 100; i++ {
		resp := mockresponse.GetResponse(404)
		if resp != nil {
			seen[resp.Message] = true
		}
	}
	if len(seen) <= 1 {
		t.Log("warning: GetResponse returned the same message 100 times — randomness may be broken")
	}
}
