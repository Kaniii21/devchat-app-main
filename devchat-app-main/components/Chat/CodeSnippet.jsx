"use client"

import React, { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

// Import Prism core
import Prism from "prismjs"

// Import required languages
import "prismjs/components/prism-clike" // Required base for many languages
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-css"
import "prismjs/components/prism-python"
import "prismjs/components/prism-java" // Added Java support
import "prismjs/components/prism-markup" // For HTML
import "prismjs/components/prism-json"

// Import theme
import "prismjs/themes/prism-tomorrow.css"

const CodeSnippet = ({ code = "", language = "javascript" }) => {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef(null)

  // Map language to Prism's supported languages
  const getLanguageClass = () => {
    const languageMap = {
      javascript: "javascript",
      js: "javascript",
      typescript: "typescript",
      ts: "typescript",
      jsx: "jsx",
      tsx: "tsx",
      python: "python",
      py: "python",
      java: "java", // Added Java mapping
      css: "css",
      html: "markup",
      xml: "markup",
      json: "json"
    }

    return languageMap[language.toLowerCase()] || "javascript"
  }

  useEffect(() => {
    if (Prism && codeRef.current) {
      try {
        const prismLang = getLanguageClass()
        
        // Verify the language is loaded
        if (!Prism.languages[prismLang]) {
          console.warn(`Prism language '${prismLang}' not loaded, defaulting to javascript`)
          codeRef.current.className = "language-javascript"
          if (Prism.languages.javascript) {
            Prism.highlightElement(codeRef.current)
          }
          return
        }

        // Ensure the element has the correct class
        codeRef.current.className = `language-${prismLang}`
        
        // Highlight the element only if the language is loaded
        if (Prism.languages[prismLang]) {
          Prism.highlightElement(codeRef.current)
        }
      } catch (error) {
        console.error("Prism highlighting error:", error)
        // Fallback to plain text if highlighting fails
        if (codeRef.current) {
          codeRef.current.className = ""
        }
      }
    }
  }, [code, language])

  const copyToClipboard = async () => {
    if (!code) return

    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const prismLanguage = getLanguageClass()

  return (
    <div className="relative rounded-md overflow-hidden border border-gray-700 my-4">
      <div className="flex items-center justify-between bg-[#2d2d2d] text-gray-300 px-4 py-2 text-xs font-mono">
        <span>{language}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 text-gray-300 hover:text-white hover:bg-white/10"
          onClick={copyToClipboard}
          aria-label="Copy code"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
      </div>
      <pre className="m-0 p-4 overflow-x-auto bg-[#1d1d1d] text-sm">
        <code
          ref={codeRef}
          className={`language-${prismLanguage} whitespace-pre-wrap`}
        >
          {code}
        </code>
      </pre>
    </div>
  )
}

export default CodeSnippet