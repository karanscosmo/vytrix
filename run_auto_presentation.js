const puppeteer = require('puppeteer');

// Helper function to pause execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to inject and display subtitles inside the browser page
async function showSubtitle(page, text) {
  try {
    await page.evaluate((t) => {
      let el = document.getElementById('vytrix-subtitles');
      if (!el) {
        el = document.createElement('div');
        el.id = 'vytrix-subtitles';
        el.style.position = 'fixed';
        el.style.bottom = '85px';
        el.style.left = '50%';
        el.style.transform = 'translateX(-50%)';
        el.style.backgroundColor = 'rgba(7, 13, 31, 0.95)';
        el.style.border = '1px solid rgba(0, 219, 231, 0.6)';
        el.style.borderRadius = '8px';
        el.style.padding = '12px 24px';
        el.style.color = '#00dbe7';
        el.style.fontFamily = 'monospace';
        el.style.fontSize = '14px';
        el.style.fontWeight = 'bold';
        el.style.textAlign = 'center';
        el.style.zIndex = '999999';
        el.style.maxWidth = '85%';
        el.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 219, 231, 0.2)';
        el.style.pointerEvents = 'none'; // Ensure it doesn't block clicks
        document.body.appendChild(el);
      }
      el.innerHTML = t;
    }, text);
  } catch (e) {
    // Fail silently if page is navigating
  }
}

// Helper to find and click a button by text content
async function clickButtonByText(page, text) {
  try {
    await page.evaluate((btnText) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const target = buttons.find(b => b.textContent.trim().toLowerCase().includes(btnText.toLowerCase()));
      if (target) target.click();
    }, text);
  } catch (e) {
    // Fail silently
  }
}

async function runShowcase() {
  console.log("\n========================================================");
  console.log("   🌪️  Vytrix OS // AUTO PRESENTATION AGENT (77 SECONDS)");
  console.log("========================================================");
  console.log(" Timed EXACTLY to match 1min 17sec ElevenLabs voiceover.");
  console.log(" Launching in full-screen mode on your display.");
  console.log(" Subtitles are running at the bottom center.");
  console.log(" Just start screen recording!");
  console.log("========================================================\n");

  const baseUrl = "http://localhost:3001";
  
  // Launch Chrome in full-screen and force desktop viewport dimensions to keep sidebar visible
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: { width: 1440, height: 900 },
    args: ['--start-fullscreen', '--no-sandbox', '--disable-setuid-sandbox']
  });

  const [page] = await browser.pages();
  await page.goto(baseUrl);
  
  // 1. Landing Page Boot (3.5 seconds)
  await showSubtitle(page, "Welcome to Vytrix OS - an AI-native climate-tech emergency operations command deck.");
  await delay(3500);
  
  // 2. Click the Autoplay Presentation card to ingress (1.5 seconds transition)
  await showSubtitle(page, "We boot straight into the 7-stage disaster cascade to simulate Category 4 Cyclone Vytrix.");
  const autoplayCardSelector = 'a[href="/dashboard?autoplay=true"]';
  await page.waitForSelector(autoplayCardSelector);
  await page.click(autoplayCardSelector);
  await delay(1500);
  
  // 3. Show Dashboard stages (8.0 seconds)
  await showSubtitle(page, "As the storm front makes landfall, flood sensors trigger levee breach and power substation shutdown warnings.");
  await delay(8000);
  
  // 4. Layer Switch: Thermal (2.5 seconds)
  await showSubtitle(page, "Interactive vector maps support live style toggling. Let's switch to the Thermal front...");
  await clickButtonByText(page, "Thermal");
  await delay(2500);
  
  // 5. Layer Switch: Topology (2.5 seconds)
  await showSubtitle(page, "And revert back to the Topology view to track rising flood levels in Sector 7.");
  await clickButtonByText(page, "Topology");
  await delay(2500);
  
  // 6. Click the AI Copilot sidebar link (2.0 seconds)
  await showSubtitle(page, "To handle dispatcher cognitive overload, we consult the Tactical Copilot AI for triage coordination.");
  const copilotLinkSelector = 'a[href="/copilot"]';
  await page.waitForSelector(copilotLinkSelector);
  await page.click(copilotLinkSelector);
  await delay(2000);
  
  // 7. Type query into AI Chat input very fast (2.0 seconds typing)
  await showSubtitle(page, "We ask the Copilot for a status report on flood defenses and power grids...");
  const chatInputSelector = 'input[placeholder*="Input operational command"]';
  await page.waitForSelector(chatInputSelector);
  await page.click(chatInputSelector);
  
  const query = "Status report on levee breach and power grid load.";
  // Typing 46 characters. 46 * 30ms = 1380ms + 620ms delay buffer = 2000ms total
  for (let char of query) {
    await page.type(chatInputSelector, char);
    await delay(30);
  }
  await delay(620);
  
  // Press Enter to submit
  await page.keyboard.press('Enter');
  
  // 8. Wait for AI response (7.5 seconds)
  await showSubtitle(page, "The Copilot analyzes our active stage, outputting the reasoning chain and shunting power link recommendations.");
  await delay(7500);
  
  // 9. Navigate to Digital Twin View (6.0 seconds)
  await showSubtitle(page, "The Bento Digital Twin console displays local atmospheric stress, wind vectors, and local sensor data.");
  const twinLinkSelector = 'a[href="/digital-twin"]';
  await page.waitForSelector(twinLinkSelector);
  await page.click(twinLinkSelector);
  await delay(6000);

  // 10. Navigate to Infrastructure View (6.0 seconds)
  await showSubtitle(page, "In the Infrastructure panel, the routing engine calculates Route Alpha to reroute evacuees clear of hazards.");
  const infraLinkSelector = 'a[href="/infrastructure"]';
  await page.waitForSelector(infraLinkSelector);
  await page.click(infraLinkSelector);
  await delay(6000);

  // 11. Navigate to Telemetry Analytics (6.0 seconds)
  await showSubtitle(page, "The Analytics deck correlates resource consumption, total evacuations, and hospital triage load on Recharts graphs.");
  const analyticsLinkSelector = 'a[href="/analytics"]';
  await page.waitForSelector(analyticsLinkSelector);
  await page.click(analyticsLinkSelector);
  await delay(6000);

  // 12. Navigate to Warning Console (4.5 seconds)
  await showSubtitle(page, "The Warning Console HUD centralizes all system alerts broadcasted across municipal responders.");
  const alertsLinkSelector = 'a[href="/alerts"]';
  await page.waitForSelector(alertsLinkSelector);
  await page.click(alertsLinkSelector);
  await delay(4500);

  // 13. Navigate to Settings HUD (4.5 seconds)
  await showSubtitle(page, "Under Settings, operators can manage synchronizer API hosts and trigger Mapbox offline vector engine fallbacks.");
  const settingsLinkSelector = 'a[href="/settings"]';
  await page.waitForSelector(settingsLinkSelector);
  await page.click(settingsLinkSelector);
  await delay(4500);
  
  // 14. Open Civilian mobile link simulator in a separate tab (2.5 seconds)
  const mobilePage = await browser.newPage();
  await mobilePage.setViewport({ width: 1440, height: 900 });
  await mobilePage.goto(`${baseUrl}/mobile`);
  await showSubtitle(mobilePage, "On the Civilian Mobile Link, a resident holds down the SOS button to sync GPS coordinates.");
  await delay(2500);
  
  // 15. Click and hold the SOS button (2.5 seconds total)
  const sosButtonSelector = 'button';
  await mobilePage.waitForSelector(sosButtonSelector);
  const button = await mobilePage.$(sosButtonSelector);
  const box = await button.boundingBox();
  
  await mobilePage.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await mobilePage.mouse.down();
  await delay(1200); // 1.2 seconds hold
  await mobilePage.mouse.up();
  await delay(1300); // 1.3 seconds rest
  
  // 16. SOS Telemetry Dispatch Review (3.0 seconds)
  await showSubtitle(mobilePage, "Their telemetry is instantly piped into the primary command deck, triggering drone supply dispatches.");
  await delay(3000);
  
  // 17. Close mobile page, return focus to dashboard (1.5 seconds)
  await mobilePage.close();
  await page.bringToFront();
  await delay(1500);
  
  // 18. Navigate back to main dashboard (1.5 seconds)
  const dashboardLinkSelector = 'a[href="/dashboard"]';
  await page.waitForSelector(dashboardLinkSelector);
  await page.click(dashboardLinkSelector);
  await delay(1500);
  
  // 19. View final recovery planning stage (6.0 seconds)
  await showSubtitle(page, "Finally, in Stage 7, the storm passes, utility assessment logs sync, and system grids return to nominal parameters.");
  await delay(6000);
  
  // 20. Final wrap up (3.5 seconds)
  await showSubtitle(page, "Vytrix OS successfully transforms environmental emergencies into structured tactical intelligence.");
  await delay(3500);
  
  console.log("\n========================================================");
  console.log("   🎉 AUTOMATED PRESENTATION TIMED TO 77s COMPLETED!");
  console.log("========================================================");
  console.log(" Closing browser window.");
  console.log("========================================================\n");
  
  await browser.close();
}

runShowcase().catch(err => {
  console.error("Showcase script caught an error:", err);
});
