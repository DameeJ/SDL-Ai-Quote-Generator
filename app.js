// Array dictionary of your engineering domain prompt tags
const pillarPrompts = {
  electrical: ["Wire a 4-bedroom duplex", "Conduit piping for new site", "Upgrade switches & sockets"],
  solar: ["5KVA Inverter System with Lithium Batteries", "Power a 1HP AC + Fridge", "4-Panel Solar Array Installation"],
  satellite: ["DSTV Explora + ExtraView Setup", "GOtv installation with mounting", "Multi-point commercial dish setup"]
};

// Function to update tags dynamically in the UI
function updatePromptTags(pillar) {
  const tagsContainer = document.querySelector('.tags-container');
  tagsContainer.innerHTML = ''; // Clear old generic tags
  
  pillarPrompts[pillar].forEach(promptText => {
    const tagButton = document.createElement('button');
    tagButton.className = 'quick-tag-btn';
    tagButton.textContent = promptText;
    
    // Clicking a tag automatically copies it into the input box
    tagButton.addEventListener('click', () => {
      document.querySelector('.quote-input-bar').value = promptText;
    });
    
    tagsContainer.appendChild(tagButton);
  });
}
async function handleQuoteGeneration() {
  const inputField = document.querySelector('.quote-input-bar');
  const userText = inputField.value;
  const activePillar = document.querySelector('.pillar-btn.active').getAttribute('data-pillar');
  const outputDisplay = document.querySelector('.output-display-area'); // The container where the text appears

  if (!userText) return;

  // 1. Show a lively loading state on the screen instead of the static text
  outputDisplay.innerHTML = "<div class='loader'>Analyzing project specs and compiling SDL pricing data...</div>";

  try {
    // 2. Call your secure Netlify serverless function
    const response = await fetch('/.netlify/functions/generate-quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemPillar: activePillar, userPrompt: userText })
    });

    const data = await response.json();

    if (data.quote) {
      // 3. Render the real, beautifully formatted AI quote directly on the page!
      outputDisplay.innerHTML = data.quote; 
    } else {
      outputDisplay.innerHTML = "Error generating quote. Please try again.";
    }

  } catch (error) {
    outputDisplay.innerHTML = "Connection error. Please check your internet connection.";
    console.error(error);
  }
}

// Add click listeners to sidebar buttons
document.querySelectorAll('.pillar-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    // Toggle active classes
    document.querySelectorAll('.pillar-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    // Get selected category and trigger UI update
    const selectedPillar = btn.getAttribute('data-pillar');
    updatePromptTags(selectedPillar);
  });
});
