import os
from playwright.sync_api import sync_playwright

BASE_URL = os.getenv("BASE_URL", "http://localhost:4173")
BROWSER = os.getenv("BROWSER", "chromium")


def _browser_type(playwright):
    if BROWSER == "firefox":
        return playwright.firefox
    if BROWSER == "webkit":
        return playwright.webkit
    return playwright.chromium


def test_homepage_title():
    with sync_playwright() as p:
        browser = _browser_type(p).launch()
        page = browser.new_page()
        page.goto(BASE_URL, wait_until="networkidle")
        assert "Josh" in page.title()
        browser.close()


def test_hero_headline():
    with sync_playwright() as p:
        browser = _browser_type(p).launch()
        page = browser.new_page()
        page.goto(BASE_URL, wait_until="networkidle")
        assert page.get_by_text("Break the Code.").first.is_visible()
        assert page.get_by_text("Not the User.").first.is_visible()
        browser.close()
