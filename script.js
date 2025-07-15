let editor = CodeMirror.fromTextArea(document.getElementById("code-editor"), {
  lineNumbers: true,
  mode: "javascript",
  theme: "default"
});

async function callAI(promptText) {
  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": "Bearer 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",
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
  const prompt = `Explain the following JavaScript code clearly and briefly:\n\n${code}`;
  updateSuggestion("⏳ Thinking...");
  const explanation = await callAI(prompt);
  updateSuggestion(explanation);
}

async function fixBug() {
  const code = editor.getValue();
  const prompt = `Check this JavaScript code for bugs or improvements:\n\n${code}`;
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

function updateSuggestion(text) {
  document.getElementById("suggestion-text").innerText = text;
}

editor.setValue(`function greet(name) {
  for (let i = 0; i < 5; i++) {
    console.log("Hello, " + name);
  }
}

greet("Replit");`);