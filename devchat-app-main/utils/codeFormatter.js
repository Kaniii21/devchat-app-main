// Utility functions for formatting code

// Format code based on language
const formatCode = (code, language) => {
  // In a real app, you might use a library like prettier
  // For this demo, we'll just do some basic formatting

  if (!code) return ""

  // Remove extra whitespace at the beginning and end
  let formattedCode = code.trim()

  // Basic indentation for JavaScript/TypeScript
  if (language === "javascript" || language === "typescript" || language === "jsx" || language === "tsx") {
    // This is a very simplified formatter
    // In a real app, you would use a proper parser and formatter
    formattedCode = formattedCode.replace(/{\s*\n/g, "{\n  ").replace(/\n\s*}/g, "\n}")
  }

  return formattedCode
}

// Detect language from code
const detectLanguage = (code) => {
  if (!code) return "plaintext"

  // Very basic detection based on file extensions or syntax
  if (code.includes("import React") || code.includes('from "react"')) {
    return code.includes("tsx") ? "tsx" : "jsx"
  }

  if (code.includes("function") || code.includes("const") || code.includes("let")) {
    return "javascript"
  }

  if (code.includes("interface") || code.includes("type ") || code.includes(": string")) {
    return "typescript"
  }

  if (code.includes("def ") || (code.includes("import ") && code.includes(":"))) {
    return "python"
  }

  if (code.includes("class ") && code.includes("{")) {
    return "java"
  }

  if (code.includes("<html") || code.includes("<!DOCTYPE")) {
    return "html"
  }

  if (code.includes("SELECT ") || code.includes("FROM ") || code.includes("WHERE ")) {
    return "sql"
  }

  return "plaintext"
}

export { formatCode, detectLanguage }
