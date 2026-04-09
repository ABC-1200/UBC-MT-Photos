import asyncio
from playwright.async_api import async_playwright
import random

async def stealth_visit(context, url):
    page = await context.new_page()
    # සැබෑ USA User කෙනෙක්ගේ Screen Size එකක් ගමු
    await page.set_viewport_size({"width": random.randint(1366, 1920), "height": random.randint(768, 1080)})
    
    try:
        print(f"USA Traffic Session Started: {url}")
        await page.goto(url, wait_until="networkidle", timeout=60000)
        
        # සයිට් එකේ ඉහළ පහළ යනවා (Human Behavior)
        for _ in range(3):
            await page.mouse.wheel(0, random.randint(300, 800))
            await asyncio.sleep(random.randint(2, 5))

        # සයිට් එක ඇතුළේ තියෙන වෙනත් ලින්ක් එකක් ක්ලික් කරලා තවත් ඇඩ්ස් ලෝඩ් කරමු
        links = await page.query_selector_all('a')
        if links:
            target_link = random.choice(links)
            await target_link.click()
            await asyncio.sleep(random.randint(15, 25))

        print("Impressions generated successfully!")
    except:
        pass
    finally:
        await page.close()

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        # USA විදිහට පේන්න Stealth Context එකක්
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
            locale="en-US",
            timezone_id="America/New_York"
        )

        url = "https://abc-1200.github.io/UBC-MT-Photos/"
        
        # එක බෝට් එකෙක් එක සැරයකදී වට 7ක් සයිට් එකේ සැරිසරනවා
        for _ in range(7):
            await stealth_visit(context, url)
            await asyncio.sleep(random.randint(1, 3))

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
