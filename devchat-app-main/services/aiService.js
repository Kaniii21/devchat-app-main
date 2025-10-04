// AI-powered code analysis service for debugging and suggestions
import { languagePatterns } from './languagePatterns';

/**
 * Analyzes code snippets for issues, suggestions, and generates fixes
 * @param {string} code - The code snippet to analyze
 * @param {string} language - The programming language of the code
 * @returns {Object} Analysis results including issues, suggestions, and fixed code
 */
const analyzeCode = async (code, language = 'javascript') => {
  // Simulate API call delay (for demo purposes)
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    // Get language-specific patterns
    const patterns = languagePatterns[language.toLowerCase()] || languagePatterns.javascript;
    
    // Initialize analysis result
    const analysis = {
      issues: [],
      suggestions: [],
      fixedCode: null,
    };

    // Skip analysis for empty code
    if (!code || code.trim() === '') {
      return {
        issues: [{
          severity: "info",
          title: "Empty code snippet",
          description: "There is no code to analyze.",
          location: "N/A",
        }],
        suggestions: [],
        fixedCode: null,
      };
    }

    // Check for common issues
    analyzeCommonIssues(code, language, patterns, analysis);
    
    // Add language-specific suggestions
    addLanguageSpecificSuggestions(code, language, patterns, analysis);
    
    // Generate fixed code if there are issues
    if (analysis.issues.length > 0) {
      analysis.fixedCode = generateFixedCode(code, language, patterns, analysis.issues);
    }

    return analysis;
  } catch (error) {
    console.error("Error analyzing code:", error);
    throw new Error("Failed to analyze code. Please try again.");
  }
};

/**
 * Analyzes code for common issues across programming languages
 */
function analyzeCommonIssues(code, language, patterns, analysis) {
  const lines = code.split('\n');
  
  // Check for syntax errors
  patterns.syntaxErrors.forEach(pattern => {
    const regex = new RegExp(pattern.regex, 'g');
    if (regex.test(code)) {
      analysis.issues.push({
        severity: "error",
        title: pattern.title,
        description: pattern.description,
        location: findPatternLocation(code, regex),
      });
    }
  });

  // Check for potential bugs
  patterns.potentialBugs.forEach(pattern => {
    const regex = new RegExp(pattern.regex, 'g');
    if (regex.test(code)) {
      analysis.issues.push({
        severity: "warning",
        title: pattern.title,
        description: pattern.description,
        location: findPatternLocation(code, regex),
      });
    }
  });

  // Check code style and best practices
  patterns.styleIssues.forEach(pattern => {
    const regex = new RegExp(pattern.regex, 'g');
    if (regex.test(code)) {
      analysis.issues.push({
        severity: "info",
        title: pattern.title,
        description: pattern.description,
        location: findPatternLocation(code, regex),
      });
    }
  });
  
  // Check for missing comments
  if (lines.length > 5) {
    const commentCount = lines.filter(line => 
      patterns.commentPatterns.some(pattern => line.trim().match(pattern))
    ).length;
    
    if (commentCount === 0) {
      analysis.issues.push({
        severity: "info",
        title: "Missing comments",
        description: "Adding comments to your code will make it more maintainable.",
        location: "Throughout code",
      });
    } else if (commentCount < lines.length / 10) {
      analysis.issues.push({
        severity: "info",
        title: "Sparse comments",
        description: "Consider adding more comments to explain complex logic.",
        location: "Throughout code",
      });
    }
  }
}

/**
 * Adds language-specific suggestions based on code analysis
 */
function addLanguageSpecificSuggestions(code, language, patterns, analysis) {
  // Add general best practices
  patterns.bestPractices.forEach(practice => {
    analysis.suggestions.push({
      title: practice.title,
      description: practice.description,
      example: practice.example,
    });
  });
  
  // Add performance suggestions if code is complex
  if (code.length > 200 || code.split('\n').length > 20) {
    patterns.performanceTips.forEach(tip => {
      analysis.suggestions.push({
        title: tip.title,
        description: tip.description,
        example: tip.example,
      });
    });
  }
  
  // Add readability suggestions
  patterns.readabilityTips.forEach(tip => {
    const regex = new RegExp(tip.detectPattern, 'g');
    if (regex.test(code)) {
      analysis.suggestions.push({
        title: tip.title,
        description: tip.description,
        example: tip.example,
      });
    }
  });
}

/**
 * Generates fixed code based on detected issues
 */
function generateFixedCode(code, language, patterns, issues) {
  let fixedCode = code;
  
  // Apply fixes for detected issues
  issues.forEach(issue => {
    const matchingFix = patterns.fixes.find(fix => fix.issueTitle === issue.title);
    if (matchingFix) {
      const regex = new RegExp(matchingFix.pattern, 'g');
      fixedCode = fixedCode.replace(regex, matchingFix.replacement);
    }
  });
  
  // Add missing comments if needed
  if (issues.some(issue => issue.title === "Missing comments")) {
    const lines = fixedCode.split('\n');
    
    // Add file header comment
    fixedCode = patterns.commentPatterns[0] + ' Main code implementation\n' + fixedCode;
    
    // For longer files, add section comments
    if (lines.length > 15) {
      const commentedLines = [];
      let inFunction = false;
      let functionStartIndex = -1;
      
      lines.forEach((line, index) => {
        // Add function comments
        if (!inFunction && patterns.functionDefinition && line.match(patterns.functionDefinition)) {
          inFunction = true;
          functionStartIndex = index;
          
          // Extract function name
          const functionNameMatch = line.match(patterns.functionNameExtraction);
          const functionName = functionNameMatch ? functionNameMatch[1] : 'function';
          
          // Add function comment
          commentedLines.push(patterns.commentPatterns[0] + ` ${functionName}: Add description here`);
        }
        
        commentedLines.push(line);
        
        // Reset function flag
        if (inFunction && line.includes('{')) {
          inFunction = false;
        }
      });
      
      fixedCode = commentedLines.join('\n');
    }
  }
  
  return fixedCode;
}

/**
 * Finds the location of a pattern in the code
 */
function findPatternLocation(code, regex) {
  const lines = code.split('\n');
  const match = code.match(regex);
  
  if (!match) return "Unknown";
  
  const position = match.index;
  let charCount = 0;
  let lineNumber = 0;
  
  for (let i = 0; i < lines.length; i++) {
    charCount += lines[i].length + 1; // +1 for newline
    if (charCount > position) {
      lineNumber = i + 1;
      break;
    }
  }
  
  return `Line ${lineNumber}`;
}

export { analyzeCode };
