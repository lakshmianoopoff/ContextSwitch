const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const FRAMES_DIR = path.join(__dirname, '../temp_demo_frames');
const ASSETS_DIR = path.join(__dirname, '../docs/assets');

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  if (!fs.existsSync(EDGE_PATH)) {
    console.error('Edge executable not found at', EDGE_PATH);
    process.exit(1);
  }

  if (fs.existsSync(FRAMES_DIR)) {
    fs.rmSync(FRAMES_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(FRAMES_DIR, { recursive: true });

  console.log('Launching Edge browser...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    defaultViewport: {
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    },
    args: ['--window-size=1280,800', '--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  console.log('Page loaded:', await page.title());

  let recording = true;
  let frameCount = 0;

  // Frame capture loop at ~10-12 FPS
  const captureLoop = (async () => {
    while (recording) {
      const start = Date.now();
      try {
        const buffer = await page.screenshot({ type: 'jpeg', quality: 85 });
        const frameFile = path.join(
          FRAMES_DIR,
          `frame_${String(frameCount++).padStart(5, '0')}.jpg`
        );
        fs.writeFileSync(frameFile, buffer);
      } catch (err) {
        // ignore sporadic screenshot errors during navigation
      }
      const elapsed = Date.now() - start;
      const wait = Math.max(10, 90 - elapsed);
      await sleep(wait);
    }
  })();

  try {
    // 1. Dashboard Overview
    console.log('1. Displaying Dashboard Overview...');
    await sleep(2000);

    // 2. Open Beginner Guide Tour
    console.log('2. Opening Beginner Guide Tour...');
    const tourBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find((b) => b.textContent && b.textContent.includes('Beginner Guide Tour'));
    });
    if (tourBtn && tourBtn.asElement()) {
      await tourBtn.asElement().click();
    }
    await sleep(2000);

    // Step 2
    console.log('  Advancing to Step 2...');
    const nextBtn1 = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find((b) => b.textContent && b.textContent.trim() === 'Next');
    });
    if (nextBtn1 && nextBtn1.asElement()) {
      await nextBtn1.asElement().click();
    }
    await sleep(2000);

    // Step 3
    console.log('  Advancing to Step 3...');
    const nextBtn2 = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find((b) => b.textContent && b.textContent.trim() === 'Next');
    });
    if (nextBtn2 && nextBtn2.asElement()) {
      await nextBtn2.asElement().click();
    }
    await sleep(2000);

    // Step 4
    console.log('  Advancing to Step 4...');
    const nextBtn3 = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find((b) => b.textContent && b.textContent.trim() === 'Next');
    });
    if (nextBtn3 && nextBtn3.asElement()) {
      await nextBtn3.asElement().click();
    }
    await sleep(2000);

    // Close Tour
    console.log('  Closing Tour modal...');
    const startExploringBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find((b) => b.textContent && b.textContent.includes('Start Exploring'));
    });
    if (startExploringBtn && startExploringBtn.asElement()) {
      await startExploringBtn.asElement().click();
    }
    await sleep(1500);

    // 3. Open Track Real Local Repo Modal
    console.log('3. Opening Track Real Local Repo modal...');
    const trackRepoBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find((b) => b.textContent && b.textContent.includes('Track Local Repo'));
    });
    if (trackRepoBtn && trackRepoBtn.asElement()) {
      await trackRepoBtn.asElement().click();
    }
    await sleep(2200);

    // Dismiss Track Repo Modal
    console.log('  Dismissing Track Local Repo modal...');
    const cancelTrackBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find((b) => b.textContent && b.textContent.includes('Cancel'));
    });
    if (cancelTrackBtn && cancelTrackBtn.asElement()) {
      await cancelTrackBtn.asElement().click();
    }
    await sleep(1500);

    // 4. Click Payment-Service Card
    console.log('4. Navigating to payment-service Briefing View...');
    const paymentCard = await page.evaluateHandle(() => {
      const cards = Array.from(document.querySelectorAll('div, button'));
      return cards.find((el) => {
        return (
          el.textContent &&
          el.textContent.includes('payment-service') &&
          el.classList.contains('group')
        );
      });
    });
    if (paymentCard && paymentCard.asElement()) {
      await paymentCard.asElement().click();
    } else {
      // Fallback selector
      await page.evaluate(() => {
        const els = Array.from(document.querySelectorAll('h3, div'));
        const el = els.find((e) => e.textContent && e.textContent.includes('payment-service'));
        if (el) el.closest('.hairline-border')?.click();
      });
    }
    await sleep(2200);

    // 5. Trigger Copy Command Toast
    console.log('5. Clicking Copy Command in Briefing...');
    const copyBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return (
        btns.find((b) => b.textContent && b.textContent.includes('Copy Briefing')) ||
        btns.find((b) => b.getAttribute('title')?.includes('Copy') || b.querySelector('svg'))
      );
    });
    if (copyBtn && copyBtn.asElement()) {
      await copyBtn.asElement().click();
    }
    await sleep(1500);

    // Scroll down to show Unresolved Blockers and What Changed
    console.log('  Scrolling down briefing view...');
    await page.evaluate(() => {
      window.scrollBy({ top: 350, behavior: 'smooth' });
    });
    await sleep(2200);

    // 6. Navigate to Pattern Intelligence
    console.log('6. Navigating to Pattern Intelligence in sidebar...');
    const patternsBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(
        (b) =>
          b.textContent &&
          (b.textContent.includes('Patterns & Bottlenecks') ||
            b.textContent.includes('Pattern Intelligence'))
      );
    });
    if (patternsBtn && patternsBtn.asElement()) {
      await patternsBtn.asElement().click();
    }
    await sleep(2500);

    // 7. Return to Dashboard
    console.log('7. Returning to Dashboard...');
    const dashNavBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find((b) => b.textContent && b.textContent.trim().startsWith('Dashboard'));
    });
    if (dashNavBtn && dashNavBtn.asElement()) {
      await dashNavBtn.asElement().click();
    }
    await sleep(2000);

    console.log('Walkthrough sequence completed successfully!');
  } finally {
    recording = false;
    await captureLoop;
    await browser.close();
  }

  console.log(`Captured ${frameCount} frames in total.`);

  // Verify frames
  const files = fs.readdirSync(FRAMES_DIR).filter((f) => f.endsWith('.jpg'));
  if (files.length === 0) {
    console.error('No frames were captured!');
    process.exit(1);
  }

  // Generate MP4 Video
  const mp4Output = path.join(ASSETS_DIR, 'demo-walkthrough.mp4');
  console.log(`Compiling MP4 video to: ${mp4Output}`);
  const ffmpegMp4Cmd = `ffmpeg -y -framerate 10 -i "${FRAMES_DIR}\\frame_%05d.jpg" -c:v libx264 -pix_fmt yuv420p -vf "scale=1280:-2" -preset fast -crf 23 "${mp4Output}"`;
  execSync(ffmpegMp4Cmd, { stdio: 'inherit' });

  // Generate Animated WebP for inline README playback
  const webpOutput = path.join(ASSETS_DIR, 'demo-walkthrough.webp');
  console.log(`Compiling animated WebP to: ${webpOutput}`);
  const ffmpegWebpCmd = `ffmpeg -y -framerate 10 -i "${FRAMES_DIR}\\frame_%05d.jpg" -vcodec libwebp -lossless 0 -q:v 70 -loop 0 -vf "scale=1024:-2:flags=lanczos" "${webpOutput}"`;
  execSync(ffmpegWebpCmd, { stdio: 'inherit' });

  // Cleanup temp frames
  fs.rmSync(FRAMES_DIR, { recursive: true, force: true });

  console.log('Demo recording generation completed successfully!');
  console.log('MP4 Size:', fs.statSync(mp4Output).size, 'bytes');
  console.log('WebP Size:', fs.statSync(webpOutput).size, 'bytes');
}

run().catch((err) => {
  console.error('Fatal recording error:', err);
  process.exit(1);
});
