/**
 * Language-specific patterns for code analysis
 * Contains regex patterns and suggestions for different programming languages
 */

const languagePatterns = {
  // JavaScript patterns
  javascript: {
    // Patterns to detect syntax errors
    syntaxErrors: [
      {
        regex: '\\w+\\s*\\(\\s*\\)\\s*\\{[^}]*$',
        title: "Unclosed function body",
        description: "A function body is opened with '{' but never closed with '}'."
      },
      {
        regex: 'const\\s+[\\w$]+\\s*;',
        title: "Uninitialized constant",
        description: "Constants (declared with 'const') must be initialized when declared."
      },
      {
        regex: '[\\w$]+\\s*\\(\\s*[^\\)]*$',
        title: "Unclosed parentheses",
        description: "Function call or declaration has unclosed parentheses."
      },
      {
        regex: 'import\\s+[^;]*$',
        title: "Missing semicolon in import",
        description: "Import statements should end with a semicolon."
      },
      {
        regex: '\\w+\\s*\\{[^}]*$',
        title: "Unclosed block",
        description: "A code block is opened with '{' but never closed with '}'."
      },
      {
        regex: '\\([^\\)]*$',
        title: "Unclosed parentheses",
        description: "There are parentheses in your code that aren't properly closed."
      },
      {
        regex: 'return\\s+\\{[^}]*$',
        title: "Unclosed object literal in return statement",
        description: "You're returning an object but forgot to close it with '}'."
      },
      {
        regex: 'if\\s*\\([^\\)]*$',
        title: "Incomplete if statement",
        description: "The condition in your if statement is not properly closed."
      }
    ],
    
    // Patterns for potential bugs
    potentialBugs: [
      {
        regex: '==\\s*null|null\\s*==|==\\s*undefined|undefined\\s*==',
        title: "Loose equality with null/undefined",
        description: "Use === instead of == when comparing with null or undefined."
      },
      {
        regex: '(var|let|const)\\s+([\\w$]+).*\\n.*\\1\\s+\\2',
        title: "Variable redeclaration",
        description: "The same variable appears to be declared multiple times."
      },
      {
        regex: '(setTimeout|setInterval)\\(\\s*function\\s*\\(\\)\\s*\\{.*\\}\\s*,\\s*0\\s*\\)',
        title: "Zero delay timer",
        description: "Timer with 0ms delay. Consider using requestAnimationFrame for browser animations."
      },
      {
        regex: 'console\\.log',
        title: "Console statement in code",
        description: "Debug statements like console.log should be removed in production code."
      },
      {
        regex: '=[^=]=',
        title: "Suspicious equality check",
        description: "You may have accidentally typed '===' when you meant '=='."
      },
      {
        regex: 'for\\s*\\([^;]*;[^;]*\\)',
        title: "Incomplete for loop",
        description: "Your for loop appears to be missing one of the required semicolons."
      },
      {
        regex: 'parseInt\\([^,)]*\\)',
        title: "Missing radix parameter in parseInt",
        description: "Always specify a radix parameter (base) when using parseInt() to avoid unexpected behavior."
      },
      {
        regex: 'Math\\.random\\(\\)\\s*<\\s*\\d',
        title: "Potentially unreliable random check",
        description: "Using Math.random() < n for probability checks can be unreliable. Consider using dedicated libraries for critical randomness."
      }
    ],
    
    // Patterns for style issues
    styleIssues: [
      {
        regex: 'var\\s+',
        title: "Use of var keyword",
        description: "Consider using const or let instead of var for better scoping."
      },
      {
        regex: '\\([^)]*=>\\s*\\{[^}]*return [^;{}]*;\\s*\\}\\)',
        title: "Avoidable return statement",
        description: "Arrow functions with simple returns can omit the return keyword and braces."
      },
      {
        regex: 'function\\s*\\([^)]*\\)\\s*\\{\\s*return [^;]*;\\s*\\}',
        title: "Function could be simplified",
        description: "Consider using an arrow function for simple returns."
      },
      {
        regex: '\\s{2,}$',
        title: "Trailing whitespace",
        description: "Lines contain trailing whitespace which should be removed."
      },
      {
        regex: 'if\\s*\\([^{]*\\)\\s*[^{\\n]',
        title: "Missing braces in if statement",
        description: "Consider using braces {} even for single-line if statements to improve readability and prevent bugs."
      },
      {
        regex: '\\w+\\s*=\\s*function\\s*\\(',
        title: "Function expression instead of declaration",
        description: "Consider using a function declaration or arrow function for better hoisting behavior and readability."
      },
      {
        regex: '\\+\\s*\'\\w+\'|\'\\w+\'\\s*\\+',
        title: "String concatenation with + operator",
        description: "Consider using template literals (`${var}`) for string concatenation for better readability."
      }
    ],
    
    // Comment patterns (regex patterns that match comments)
    commentPatterns: [
      '//', 
      '/\\*'
    ],
    
    // Function definition and name extraction
    functionDefinition: 'function\\s+([\\w$]+)|([\\w$]+)\\s*=\\s*function|([\\w$]+)\\s*=\\s*\\(',
    functionNameExtraction: 'function\\s+([\\w$]+)|([\\w$]+)\\s*=',
    
    // Best practice suggestions
    bestPractices: [
      {
        title: "Use arrow functions for callbacks",
        description: "Arrow functions provide a more concise syntax and lexically bind the this value.",
        example: 'const handleClick = () => {\n  console.log("Clicked");\n};'
      },
      {
        title: "Destructure objects for cleaner code",
        description: "Use object destructuring to make your code more readable.",
        example: "const { name, age } = user;"
      },
      {
        title: "Use template literals for string concatenation",
        description: "Template literals provide a cleaner way to concatenate strings.",
        example: "const greeting = `Hello, ${name}!`;"
      },
      {
        title: "Use optional chaining for nested properties",
        description: "Optional chaining (?.) prevents errors when accessing nested properties that might be null or undefined.",
        example: "const userName = user?.profile?.name;"
      },
      {
        title: "Use nullish coalescing operator for defaults",
        description: "The nullish coalescing operator (??) provides a default only when the value is null or undefined.",
        example: "const count = data.count ?? 0;"
      },
      {
        title: "Use array/object spread for shallow copies",
        description: "Spread syntax creates clean shallow copies of arrays and objects.",
        example: "const newArray = [...oldArray];\nconst newObject = { ...oldObject };"
      }
    ],
    
    // Performance tips
    performanceTips: [
      {
        title: "Cache array length in loops",
        description: "Store array length in a variable when iterating to avoid recalculating it.",
        example: "const len = array.length;\nfor (let i = 0; i < len; i++) { ... }"
      },
      {
        title: "Use modern array methods",
        description: "Methods like map, filter, and reduce are more declarative and often clearer than loops.",
        example: "const doubled = numbers.map(num => num * 2);"
      },
      {
        title: "Use memoization for expensive calculations",
        description: "Cache results of expensive function calls to avoid redundant computation.",
        example: "const memoizedFn = useMemo(() => {\n  return expensiveCalculation(a, b);\n}, [a, b]);"
      },
      {
        title: "Avoid unnecessary re-renders in React",
        description: "Use React.memo, useMemo, and useCallback to prevent unnecessary re-renders.",
        example: "const MemoizedComponent = React.memo(Component);"
      },
      {
        title: "Debounce event handlers for frequent events",
        description: "Debounce functions that handle frequent events like scroll or resize.",
        example: "const debouncedHandler = debounce(handleScroll, 200);"
      }
    ],
    
    // Readability tips
    readabilityTips: [
      {
        detectPattern: 'if\\s*\\(.+\\)\\s*\\{\\s*return[^}]+\\}\\s*else\\s*\\{',
        title: "Simplify conditional returns",
        description: "You can often eliminate the else clause when the if clause returns.",
        example: "if (condition) {\n  return valueA;\n}\nreturn valueB;"
      },
      {
        detectPattern: '\\([^)]*(&&|\\|\\|)[^)]*\\)',
        title: "Consider extracting complex conditions",
        description: "Extract complex logical expressions into well-named variables or functions.",
        example: "const isValidUser = hasPermission && isActive;\nif (isValidUser) { ... }"
      },
      {
        detectPattern: '\\?\\s*true\\s*:\\s*false',
        title: "Simplify boolean expressions",
        description: "Instead of 'condition ? true : false', you can simply use the condition directly.",
        example: "// Instead of:\nconst isValid = age > 18 ? true : false;\n// Use:\nconst isValid = age > 18;"
      },
      {
        detectPattern: '\\!\\!\\w+',
        title: "Consider Boolean() for type conversion",
        description: "Instead of using !! for converting to boolean, consider using Boolean() for clarity.",
        example: "// Instead of:\nconst exists = !!value;\n// Consider:\nconst exists = Boolean(value);"
      }
    ],
    
    // Fixes for common issues
    fixes: [
      {
        issueTitle: "Use of var keyword",
        pattern: "var\\s+([\\w$]+)",
        replacement: "let $1"
      },
      {
        issueTitle: "Console statement in code",
        pattern: "(console\\.log\\([^)]*\\));",
        replacement: "// $1;"
      },
      {
        issueTitle: "Loose equality with null/undefined",
        pattern: "(==)\\s*(null|undefined)",
        replacement: "=== $2"
      },
      {
        issueTitle: "Trailing whitespace",
        pattern: "\\s+$",
        replacement: ""
      },
      {
        issueTitle: "Avoidable return statement",
        pattern: "\\(([^)]*)\\)\\s*=>\\s*\\{\\s*return ([^;]*)\\s*;?\\s*\\}",
        replacement: "($1) => $2"
      },
      {
        issueTitle: "Simplify boolean expressions",
        pattern: "(\\w+)\\s*\\?\\s*true\\s*:\\s*false",
        replacement: "$1"
      },
      {
        issueTitle: "Missing radix parameter in parseInt",
        pattern: "parseInt\\(([^,)]*)\\)",
        replacement: "parseInt($1, 10)"
      }
    ]
  },
  
  // Python patterns
  python: {
    syntaxErrors: [
      {
        regex: 'def\\s+[\\w_]+\\s*\\([^)]*:[^\\n]*$',
        title: "Missing parenthesis in function definition",
        description: "Function definition is missing a closing parenthesis."
      },
      {
        regex: 'for\\s+[\\w_]+\\s+in\\s+[\\w_]+\\s*:[^\\n]*$',
        title: "Incomplete for loop",
        description: "For loop is missing proper indentation or body."
      }
    ],
    potentialBugs: [
      {
        regex: 'except:',
        title: "Bare except clause",
        description: "Using a bare 'except:' catches all exceptions, which may hide bugs. Specify the exceptions you want to catch."
      },
      {
        regex: '\\s*is\\s+(True|False)',
        title: "Comparison to True/False",
        description: "Instead of 'x is True', use 'x' directly in conditionals. Instead of 'x is False', use 'not x'."
      },
      {
        regex: 'print\\s*\\(',
        title: "Print statement in code",
        description: "Debug print statements should be removed in production code."
      }
    ],
    styleIssues: [
      {
        regex: '\\t',
        title: "Use of tabs",
        description: "PEP 8 recommends using 4 spaces per indentation level instead of tabs."
      },
      {
        regex: '\\w+\\s=\\s*\\w+',
        title: "Missing whitespace around operator",
        description: "PEP 8 recommends adding whitespace around operators."
      }
    ],
    commentPatterns: [
      '#', 
      '"""'
    ],
    functionDefinition: 'def\\s+([\\w_]+)',
    functionNameExtraction: 'def\\s+([\\w_]+)',
    bestPractices: [
      {
        title: "Use list comprehensions",
        description: "List comprehensions are more concise and often faster than building lists with for loops.",
        example: "squares = [x**2 for x in range(10)]"
      },
      {
        title: "Use context managers",
        description: "Use with statements for file operations to ensure resources are properly cleaned up.",
        example: "with open('file.txt', 'r') as f:\n    content = f.read()"
      }
    ],
    performanceTips: [
      {
        title: "Use generators for large sequences",
        description: "For large sequences, use generators instead of lists to save memory.",
        example: "def get_numbers():\n    for i in range(1000):\n        yield i"
      }
    ],
    readabilityTips: [
      {
        detectPattern: 'if.*:\\s*\\n\\s*return.*\\s*\\n\\s*else:\\s*\\n\\s*return',
        title: "Simplify conditional returns",
        description: "You can often eliminate the else clause when the if clause returns.",
        example: "if condition:\n    return value_a\nreturn value_b"
      }
    ],
    fixes: [
      {
        issueTitle: "Missing whitespace around operator",
        pattern: "(\\w+)(=)(\\w+)",
        replacement: "$1 = $3"
      },
      {
        issueTitle: "Use of tabs",
        pattern: "\\t",
        replacement: "    "
      },
      {
        issueTitle: "Bare except clause",
        pattern: "except:",
        replacement: "except Exception:"
      }
    ]
  },
  
  // TypeScript patterns (extends JavaScript patterns)
  typescript: {
    syntaxErrors: [
      {
        regex: '\\w+\\s*\\(\\s*\\)\\s*\\{[^}]*$',
        title: "Unclosed function body",
        description: "A function body is opened with '{' but never closed with '}'."
      },
      {
        regex: 'const\\s+[\\w$]+\\s*;',
        title: "Uninitialized constant",
        description: "Constants (declared with 'const') must be initialized when declared."
      },
      {
        regex: 'interface\\s+[A-Z][\\w$]*\\s*\\{[^}]*$',
        title: "Unclosed interface",
        description: "Interface definition is missing a closing brace."
      }
    ],
    potentialBugs: [
      {
        regex: '==\\s*null|null\\s*==|==\\s*undefined|undefined\\s*==',
        title: "Loose equality with null/undefined",
        description: "Use === instead of == when comparing with null or undefined."
      },
      {
        regex: '(var|let|const)\\s+([\\w$]+).*\\n.*\\1\\s+\\2',
        title: "Variable redeclaration",
        description: "The same variable appears to be declared multiple times."
      },
      {
        regex: 'as\\s+any',
        title: "Type assertion to any",
        description: "Avoid using 'as any' as it defeats TypeScript's type checking."
      }
    ],
    styleIssues: [
      {
        regex: 'var\\s+',
        title: "Use of var keyword",
        description: "Consider using const or let instead of var for better scoping."
      },
      {
        regex: 'function\\s*\\([^)]*\\)\\s*:\\s*any',
        title: "Function returns any",
        description: "Specify a more precise return type than 'any' when possible."
      }
    ],
    commentPatterns: [
      '//', 
      '/\\*'
    ],
    functionDefinition: 'function\\s+([\\w$]+)|([\\w$]+)\\s*=\\s*function|([\\w$]+)\\s*=\\s*\\(',
    functionNameExtraction: 'function\\s+([\\w$]+)|([\\w$]+)\\s*=',
    bestPractices: [
      {
        title: "Use interface for object shapes",
        description: "Define interfaces for objects to improve code documentation and type safety.",
        example: "interface User {\n  id: number;\n  name: string;\n  email: string;\n}"
      },
      {
        title: "Use typed function parameters",
        description: "Specify types for function parameters to catch errors early.",
        example: "function greet(name: string): string {\n  return `Hello, ${name}`;\n}"
      },
      {
        title: "Use enums for related constants",
        description: "Use enums to group related constants and improve type safety.",
        example: "enum Direction {\n  Up = 'UP',\n  Down = 'DOWN',\n  Left = 'LEFT',\n  Right = 'RIGHT'\n}"
      }
    ],
    performanceTips: [
      {
        title: "Cache array length in loops",
        description: "Store array length in a variable when iterating to avoid recalculating it.",
        example: "const len = array.length;\nfor (let i = 0; i < len; i++) { ... }"
      },
      {
        title: "Use modern array methods",
        description: "Methods like map, filter, and reduce are more declarative and often clearer than loops.",
        example: "const doubled = numbers.map(num => num * 2);"
      }
    ],
    readabilityTips: [
      {
        detectPattern: 'if\\s*\\(.+\\)\\s*\\{\\s*return[^}]+\\}\\s*else\\s*\\{',
        title: "Simplify conditional returns",
        description: "You can often eliminate the else clause when the if clause returns.",
        example: "if (condition) {\n  return valueA;\n}\nreturn valueB;"
      }
    ],
    fixes: [
      {
        issueTitle: "Use of var keyword",
        pattern: "var\\s+([\\w$]+)",
        replacement: "let $1"
      },
      {
        issueTitle: "Function returns any",
        pattern: "(function\\s*\\([^)]*\\))\\s*:\\s*any",
        replacement: "$1: unknown"
      }
    ]
  }
};

export { languagePatterns }; 