"""
E2E Selenium Test: Real-time Chat Flow
Tests that two users can exchange messages via the chat feature.
"""
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

BASE_URL = "http://localhost:3000"
TEACHER_EMAIL = "teacher@test.com"
TEACHER_PASS = "teacherpass"
STUDENT_EMAIL = "student@test.com"
STUDENT_PASS = "studentpass"


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


def run_chat_e2e():
    print("\n" + "="*60)
    print("CHAT E2E TEST — Real-time Messaging")
    print("="*60)

    driver1 = make_driver(headless=False)
    driver2 = make_driver(headless=False)
    passed = 0
    failed = 0

    try:
        # ── Login teacher ─────────────────────────────────────
        print("\n[1/5] Logging in as Teacher...")
        if login(driver1, TEACHER_EMAIL, TEACHER_PASS):
            print("  ✅ Teacher logged in")
            passed += 1
        else:
            print("  ❌ Teacher login failed — check credentials and DB")
            failed += 1
            return

        # ── Navigate to chat ──────────────────────────────────
        print("[2/5] Navigating to Chat page...")
        driver1.get(f"{BASE_URL}/chat")
        time.sleep(2)
        if "chat" in driver1.current_url:
            print("  ✅ Chat page loaded")
            passed += 1
        else:
            print("  ❌ Chat page did not load")
            failed += 1

        # ── Start new chat with student ────────────────────────
        print("[3/5] Starting chat with student...")
        try:
            new_btn = WebDriverWait(driver1, 5).until(
                EC.element_to_be_clickable((By.XPATH, "//button[.//svg[contains(@class,'lucide-plus')]]"))
            )
            new_btn.click()
            time.sleep(1)
            search_input = driver1.find_element(By.XPATH, "//input[@placeholder='Search by name...']")
            search_input.send_keys("student")
            time.sleep(1.5)
            first_user = WebDriverWait(driver1, 5).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(@class,'hover:bg-gray-50')]"))
            )
            first_user.click()
            time.sleep(1.5)
            print("  ✅ Chat room created with student")
            passed += 1
        except Exception as e:
            print(f"  ⚠️  Could not create chat room: {e}")
            failed += 1

        # ── Send a message ────────────────────────────────────
        print("[4/5] Teacher sends a message...")
        test_message = f"Hello from teacher! Time: {int(time.time())}"
        try:
            msg_input = WebDriverWait(driver1, 5).until(
                EC.presence_of_element_located((By.XPATH, "//input[@placeholder='Type a message...']"))
            )
            msg_input.send_keys(test_message)
            send_btn = driver1.find_element(By.XPATH, "//button[.//svg[contains(@class,'lucide-send')]]")
            send_btn.click()
            time.sleep(1)
            # Check if message appears in chat
            page_text = driver1.page_source
            if test_message in page_text:
                print("  ✅ Message sent and visible in teacher's view")
                passed += 1
            else:
                print("  ⚠️  Message sent but not found in DOM")
                failed += 1
        except Exception as e:
            print(f"  ❌ Could not send message: {e}")
            failed += 1

        # ── Login student and verify message ──────────────────
        print("[5/5] Student receives message...")
        try:
            if login(driver2, STUDENT_EMAIL, STUDENT_PASS):
                driver2.get(f"{BASE_URL}/chat")
                time.sleep(2.5)
                page_text2 = driver2.page_source
                if test_message in page_text2:
                    print("  ✅ Message received in student's real-time view!")
                    passed += 1
                else:
                    print("  ⚠️  Student view doesn't show the message yet (WebSocket may need room:join)")
                    failed += 1
            else:
                print("  ❌ Student login failed")
                failed += 1
        except Exception as e:
            print(f"  ❌ Student verification error: {e}")
            failed += 1

    finally:
        driver1.quit()
        driver2.quit()

    print(f"\n{'='*60}")
    print(f"CHAT E2E RESULTS: {passed} passed, {failed} failed")
    print('='*60)


if __name__ == "__main__":
    run_chat_e2e()
