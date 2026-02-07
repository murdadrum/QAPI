import os
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE_URL = os.getenv("BASE_URL", "http://localhost:4173")
BROWSER = os.getenv("BROWSER", "chromium")


def _browser_type(playwright):
    if BROWSER == "firefox":
        return playwright.firefox
    if BROWSER == "webkit":
        return playwright.webkit
    return playwright.chromium


def _new_page(playwright, trace_name):
    traces_dir = Path("traces")
    traces_dir.mkdir(exist_ok=True)
    browser = _browser_type(playwright).launch()
    context = browser.new_context()
    context.tracing.start(screenshots=True, snapshots=True, sources=True)
    page = context.new_page()
    return browser, context, page, traces_dir / f"{trace_name}.zip"


def _close_with_trace(browser, context, trace_path):
    context.tracing.stop(path=str(trace_path))
    context.close()
    browser.close()


def test_homepage_title():
    with sync_playwright() as p:
        browser, context, page, trace_path = _new_page(p, "homepage-title")
        page.goto(BASE_URL, wait_until="networkidle")
        assert "Josh" in page.title()
        _close_with_trace(browser, context, trace_path)


def test_hero_headline():
    with sync_playwright() as p:
        browser, context, page, trace_path = _new_page(p, "hero-headline")
        page.goto(BASE_URL, wait_until="networkidle")
        assert page.get_by_text("Break the Code.").first.is_visible()
        assert page.get_by_text("Not the User.").first.is_visible()
        _close_with_trace(browser, context, trace_path)


def test_automation_modal_opens():
    with sync_playwright() as p:
        browser, context, page, trace_path = _new_page(p, "automation-modal")
        page.goto(BASE_URL, wait_until="networkidle")
        page.get_by_role("button", name="Crossbrowser E2E").click()
        # Modal should appear and show QA dashboard
        page.wait_for_selector("#demo-modal:not(.hidden)", timeout=5000)
        assert page.get_by_text("Playwright + Pytest E2E").first.is_visible()
        _close_with_trace(browser, context, trace_path)


def test_project_demo_modal_opens():
    with sync_playwright() as p:
        browser, context, page, trace_path = _new_page(p, "project-demo-modal")
        page.goto(BASE_URL, wait_until="networkidle")
        page.locator(".project-demo").first.click()
        page.wait_for_selector("#project-demo-modal:not(.hidden)", timeout=5000)
        assert page.get_by_text("Project Demo").first.is_visible()
        _close_with_trace(browser, context, trace_path)


def test_contact_form_submit_alert():
    with sync_playwright() as p:
        browser, context, page, trace_path = _new_page(p, "contact-form")
        page.goto(BASE_URL, wait_until="networkidle")
        page.fill('input[placeholder="John Doe"]', "QA Test")
        page.fill('input[type="email"]', "qa@test.dev")
        page.fill('textarea[placeholder="Tell me about your project..."]', "Hello from QA")
        message = {}

        def handle_dialog(dialog):
            message["text"] = dialog.message
            dialog.accept()

        page.on("dialog", handle_dialog)
        page.get_by_role("button", name="Send Message").click()
        assert "Thanks for reaching out" in message.get("text", "")
        _close_with_trace(browser, context, trace_path)
