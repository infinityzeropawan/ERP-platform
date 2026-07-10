"""
E2E Selenium Test: AI Notes Flow
Tests that a user can configure an AI key, generate notes, and see the response.
"""
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

BASE_URL = "http://localhost:3000"
STUDENT_EMAIL = "student@test.com"
STUDENT_PASS = "studentpass"

# Note: this test mocks the API key usage to avoid billing during E2E runs.
# It expects the API to return a 401/Invalid key error if a fake key is used.
FAKE_API_KEY = "test_fake_api_key_123456"


def make_driver(headless=True):
    opts = webdriver.ChromeOptions()
    if headless:
        opts.add_argument("--headless=new")
    opts.add_argument("--no-sandbox")
    opts.add_argument("--disable-dev-shm-usage")
    opts.add_argument("--window-size=1280,900")
    return webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=opts)


def login(driver, email, password):
    driver.get(f"{BASE_URL}/login")
    time.sleep(1.5)
    email_field = driver.find_element(By.CSS_SELECTOR, "input[type='email']")
    pw_field = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
    email_field.clear()
    email_field.send_keys(email)
    pw_field.clear()
    pw_field.send_keys(password)
    driver.find_element(By.CSS_SELECTOR, "button[type='submit']").click()
    time.sleep(2)
    return "/login" not in driver.current_url


def run_ai_notes_e2e():
    print("\n" + "="*60)
    print("AI NOTES E2E TEST — Key config and Generation")
    print("="*60)

    driver = make_driver(headless=False)
    passed = 0
    failed = 0

    try:
        # ── Login student ─────────────────────────────────────
        print("\n[1/4] Logging in as Student...")
        if login(driver, STUDENT_EMAIL, STUDENT_PASS):
            print("  ✅ Student logged in")
            passed += 1
        else:
            print("  ❌ Student login failed")
            failed += 1
            return

        # ── Navigate to AI Settings & Save Key ────────────────
        print("[2/4] Navigating to AI Settings & Saving Key...")
        driver.get(f"{BASE_URL}/student/ai-settings")
        time.sleep(2)
        
        try:
            # We are saving a fake key for testing purposes to see if the system connects properly.
            key_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
            key_input.clear()
            key_input.send_keys(FAKE_API_KEY)
            
            # Click save button
            save_btn = driver.find_element(By.XPATH, "//button[.//svg[contains(@class,'lucide-key')]]")
            save_btn.click()
            
            # Wait for success message
            WebDriverWait(driver, 5).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Personal AI key saved')]"))
            )
            print("  ✅ AI Key saved successfully")
            passed += 1
        except Exception as e:
            print(f"  ❌ Could not save AI key: {e}")
            failed += 1

        # ── Navigate to AI Notes ──────────────────────────────
        print("[3/4] Navigating to AI Notes...")
        driver.get(f"{BASE_URL}/student/ai-notes")
        time.sleep(2)
        if "ai-notes" in driver.current_url:
            print("  ✅ AI Notes page loaded")
            passed += 1
        else:
            print("  ❌ AI Notes page did not load")
            failed += 1

        # ── Generate Notes (Expecting Key Error) ───────────────
        print("[4/4] Generating Notes with Fake Key...")
        try:
            topic_input = driver.find_element(By.CSS_SELECTOR, "textarea")
            topic_input.send_keys("Test Topic for Automation")
            
            generate_btn = driver.find_element(By.XPATH, "//button[contains(., 'Generate Notes')]")
            generate_btn.click()
            
            # Because it's a fake key, we expect an error message from the backend
            error_box = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'InvalidApiKey') or contains(text(), 'AI Error')]"))
            )
            
            if error_box:
                print("  ✅ Correctly caught the invalid API key error from provider")
                passed += 1
        except Exception as e:
            print(f"  ❌ Generation flow failed: {e}")
            failed += 1

    finally:
        driver.quit()

    print(f"\n{'='*60}")
    print(f"AI NOTES E2E RESULTS: {passed} passed, {failed} failed")
    print('='*60)


if __name__ == "__main__":
    run_ai_notes_e2e()
