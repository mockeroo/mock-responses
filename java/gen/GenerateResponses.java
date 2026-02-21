//go:build ignore — this comment is for documentation only; see the README for usage.

import java.io.*;
import java.nio.file.*;
import java.util.*;
import java.util.regex.*;

/**
 * Standalone generator that reads ../responses/*.json and writes
 * src/main/java/com/mockeroo/mockresponses/ResponsesData.java.
 *
 * Run from the java/ directory:
 *   javac gen/GenerateResponses.java -d gen/out && java -cp gen/out GenerateResponses
 */
public class GenerateResponses {
    public static void main(String[] args) throws Exception {
        Path responsesDir = Paths.get("..", "responses");
        Path outFile = Paths.get(
                "src", "main", "java", "com", "mockeroo", "mockresponses", "ResponsesData.java");

        List<int[]> codes = new ArrayList<>();
        Map<Integer, List<String>> data = new TreeMap<>();

        try (DirectoryStream<Path> stream = Files.newDirectoryStream(responsesDir, "*.json")) {
            for (Path file : stream) {
                String name = file.getFileName().toString();
                int code = Integer.parseInt(name.replace(".json", ""));
                String json = new String(Files.readAllBytes(file), "UTF-8");
                List<String> messages = parseJsonStringArray(json);
                if (!messages.isEmpty()) {
                    data.put(code, messages);
                }
            }
        }

        try (PrintWriter w = new PrintWriter(new FileWriter(outFile.toFile()))) {
            w.println("// Code generated from responses/*.json by GenerateResponses; DO NOT EDIT.");
            w.println("package com.mockeroo.mockresponses;");
            w.println();
            w.println("import java.util.Collections;");
            w.println("import java.util.LinkedHashMap;");
            w.println("import java.util.Map;");
            w.println();
            w.println("final class ResponsesData {");
            w.println("    static final Map<Integer, String[]> RESPONSES;");
            w.println();
            w.println("    static {");
            w.println("        Map<Integer, String[]> m = new LinkedHashMap<>();");
            for (Map.Entry<Integer, List<String>> entry : data.entrySet()) {
                w.println("        m.put(" + entry.getKey() + ", new String[]{");
                for (String msg : entry.getValue()) {
                    w.println("            \"" + escapeJava(msg) + "\",");
                }
                w.println("        });");
            }
            w.println("        RESPONSES = Collections.unmodifiableMap(m);");
            w.println("    }");
            w.println();
            w.println("    private ResponsesData() {}");
            w.println("}");
        }

        System.out.println("Generated " + outFile);
    }

    /** Minimal JSON string-array parser — sufficient for the responses/*.json format. */
    private static List<String> parseJsonStringArray(String json) {
        List<String> result = new ArrayList<>();
        Pattern p = Pattern.compile("\"((?:[^\"\\\\]|\\\\.)*)\"");
        Matcher m = p.matcher(json);
        while (m.find()) {
            String raw = m.group(1);
            raw = raw.replace("\\\"", "\"")
                     .replace("\\\\", "\\")
                     .replace("\\/", "/")
                     .replace("\\n", "\n")
                     .replace("\\r", "\r")
                     .replace("\\t", "\t");
            result.add(raw);
        }
        return result;
    }

    private static String escapeJava(String s) {
        return s.replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
