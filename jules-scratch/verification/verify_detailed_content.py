import os
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        page.goto('http://localhost:8080/apps/philosophy-timeline/')

        # Click the first philosopher card (Socrates)
        page.click('.philosopher-card')

        # Wait for the modal to be visible
        page.wait_for_selector('#philosopher-modal', state='visible')

        # Click the summary to expand the detailed contributions
        page.click('details > summary')

        # Wait for the content to be visible
        page.wait_for_selector('#modal-contributions', state='visible')

        # Take a screenshot of the modal
        page.locator('#philosopher-modal .bg-white').screenshot(path='jules-scratch/verification/detailed_content_screenshot.png')

        browser.close()

if __name__ == '__main__':
    run()
