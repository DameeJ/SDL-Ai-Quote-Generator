// Dynamic tags mapped to SDL's 3 Core Pillars
const pillarPrompts = {
  electrical: ["Wire a 4-bedroom duplex", "Conduit piping for new site", "Upgrade switches & sockets"],
  solar: ["5KVA Inverter System with Lithium Batteries", "Power a 1HP AC + Fridge", "4-Panel Solar Array Installation"],
  satellite: ["DSTV Explora + ExtraView Setup", "GOtv installation with mounting", "Multi-point commercial dish setup"]
};

// Update quick tags layout based on selection
function updatePromptTags(pillar) {
  const tagsContainer = document.getElementById('tags-container');
  tagsContainer.innerHTML = ''; 
  
  pillarPrompts[pillar].forEach(promptText => {
    const tagButton = document.createElement('button');
    tagButton.className = 'quick-tag-btn';
    tagButton.textContent = promptText;
    
    tagButton.addEventListener('click', () => {
      document.getElementById('project-prompt').value = promptText;
    });
    
    tagsContainer.appendChild(tagButton);
  });
}

// Sidebar Selection Logic
document.querySelectorAll('.pillar-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pillar-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const selectedPillar = btn.getAttribute('data-pillar');
    updatePromptTags(selectedPillar);
  });
});

// Initialize with Electrical Tags on page load
updatePromptTags('electrical');

// LIVE OPENAI INTERACTION FROM BROWSER
async function generateAIQuote() {
  const promptInput = document.getElementById('project-prompt');
  const apiKeyInput = document.getElementById('api-key-input');
  const outputDisplay = document.getElementById('output-display');
  const activePillarLabel = document.querySelector('.pillar-btn.active').textContent;

  const userPrompt = promptInput.value;
  const apiKey = apiKeyInput.value;

  if (!userPrompt) {
    alert("Please enter details describing your electrical or solar project scope first!");
    return;
  }

  if (!apiKey) {
    alert("Please paste your OpenAI API Key into the sidebar field to run the generator.");
    return;
  }

  outputDisplay.innerHTML = `<div style="color: #ff6600;">⚡ Analyzing specifications and compiling itemized SDL pricing schema... Please wait.</div>`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // Cost-effective, lightning-fast model
        messages: [
          {
            role: "system",
            content: `You are an elite, highly accurate quotation engineer for Samdamlet Electrical Engineering. 
            Generate a comprehensive, itemized project estimate for the category: ${activePillarLabel}.
            Provide a clean layout listing necessary technical equipment, wiring materials, structural fittings, and estimated field labor installation costs. Use clear formatting.`
          },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();

    if (data.choices && data.choices[0]) {
      // Replaces line breaks for clean output printing
      outputDisplay.innerHTML = data.choices[0].message.content.replace(/\n/g, "<br>");
    } else {
      outputDisplay.innerHTML = `<span style="color: red;">Error: ${data.error ? data.error.message : 'Invalid API response.'}</span>`;
    }

  } catch (error) {
    outputDisplay.innerHTML = `<span style="color: red;">Connection failed: ${error.message}</span>`;
  }
}

// Event Triggers
document.getElementById('generate-btn').addEventListener('click', generateAIQuote);
document.getElementById('project-prompt').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') generateAIQuote();
});
