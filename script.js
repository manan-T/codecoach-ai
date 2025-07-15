let editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
  lineNumbers: true,
  mode: "javascript",
  theme: "default",
  autoCloseBrackets: true,
  matchBrackets: true,
  indentUnit: 2,
  tabSize: 2
});

const languageExamples = {
  javascript: `// Start writing your JavaScript code here
// Use the AI suggestions to help you code!

`,
  python: `# Start writing your Python code here
# Use the AI suggestions to help you code!

`,
  java: `// Start writing your Java code here
// Use the AI suggestions to help you code!

`,
  cpp: `// Start writing your C++ code here
// Use the AI suggestions to help you code!

`,
  html: `<!-- Start writing your HTML code here -->
<!-- Use the AI suggestions to help you code! -->

`,
  css: `/* Start writing your CSS code here */
/* Use the AI suggestions to help you code! */

`
};

function changeLanguage() {
  const language = document.getElementById("language-select").value;
  editor.setOption("mode", language === "cpp" ? "text/x-c++src" : language);
  editor.setValue(languageExamples[language]);
}

function changeTheme() {
  const theme = document.getElementById("theme-select").value;
  editor.setOption("theme", theme);
}

async function callAI(promptText) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer API_KEY",
      "Content-Type": "application/json",
      "HTTP-Referer": "https://replit.com/@manantiwari392",
      "X-Title": "CodeCoachAI"
    },
    body: JSON.stringify({
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: "user", content: promptText }]
    })
  });

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "No response from model.";
}

async function explainCode() {
  const code = editor.getSelection() || editor.getValue();
  const language = document.getElementById("language-select").value;
  const prompt = `Explain the following ${language} code clearly and briefly:\n\n${code}`;
  updateSuggestion("⏳ Thinking...");
  const explanation = await callAI(prompt);
  updateSuggestion(explanation);
}

async function fixBug() {
  const code = editor.getValue();
  const language = document.getElementById("language-select").value;
  const prompt = `Check this ${language} code for bugs or improvements:\n\n${code}`;
  updateSuggestion("⏳ Analyzing...");
  const fix = await callAI(prompt);
  updateSuggestion(fix);
}

async function askQuestion() {
  const code = editor.getSelection() || editor.getValue();
  const prompt = `Answer this programming question about the following code:\n\n${code}\n\nQuestion: What does this code do?`;
  updateSuggestion("🤔 Asking...");
  const answer = await callAI(prompt);
  updateSuggestion(answer);
}

async function formatCode() {
  const code = editor.getValue();
  const language = document.getElementById("language-select").value;
  const prompt = `Format and beautify this ${language} code with proper indentation and spacing:\n\n${code}`;
  updateSuggestion("✨ Formatting...");
  const formatted = await callAI(prompt);
  updateSuggestion(formatted);
}

async function validateCode() {
  const code = editor.getValue();
  const language = document.getElementById("language-select").value;
  const prompt = `Validate this ${language} code for syntax errors, potential issues, and best practices:\n\n${code}`;
  updateSuggestion("✅ Validating...");
  const validation = await callAI(prompt);
  updateSuggestion(validation);
}

async function optimizeCode() {
  const code = editor.getValue();
  const language = document.getElementById("language-select").value;
  const prompt = `Optimize this ${language} code for better performance, readability, and maintainability:\n\n${code}`;
  updateSuggestion("⚡ Optimizing...");
  const optimized = await callAI(prompt);
  updateSuggestion(optimized);
}

async function generateDocumentation() {
  const code = editor.getValue();
  const language = document.getElementById("language-select").value;
  const prompt = `Generate comprehensive documentation for this ${language} code including function descriptions, parameters, and usage examples:\n\n${code}`;
  updateSuggestion("📝 Generating docs...");
  const docs = await callAI(prompt);
  updateSuggestion(docs);
}

async function executeCode() {
  const code = editor.getValue();
  const language = document.getElementById("language-select").value;
  const outputDiv = document.getElementById("code-output");
  
  outputDiv.innerHTML = "🚀 Executing code...";
  
  if (language === "javascript") {
    try {
      const originalLog = console.log;
      let output = "";
      console.log = function(...args) {
        output += args.join(" ") + "\n";
      };
      
      eval(code);
      console.log = originalLog;
      outputDiv.innerHTML = output || "✅ Code executed successfully (no output)";
    } catch (error) {
      outputDiv.innerHTML = `❌ Error: ${error.message}`;
    }
  } else {
    // For other languages, simulate execution with AI
    const prompt = `Simulate the execution of this ${language} code and show what the output would be:\n\n${code}`;
    const result = await callAI(prompt);
    outputDiv.innerHTML = `📝 Simulated output:\n${result}`;
  }
}

function updateSuggestion(text) {
  document.getElementById("suggestion-text").innerText = text;
}

// Set initial content to blank JavaScript template
editor.setValue(languageExamples.javascript);