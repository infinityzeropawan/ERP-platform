import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from core.utils import wait_for_element, log, FRONTEND_URL

def login(driver, role, email=None, password=None):
    if not email or not password:
        if role == "superadmin":
            email, password = "superadmin@buildroonix.com", "superpass123"
        elif role == "admin":
            email, password = "sch@greenwood.com", "schpass123"
        elif role == "teacher":
            email, password = "pawankumar@school.com", "teachpass123"
        elif role == "student":
            email, password = "aman@school.com", "amanpass123"

    login_url = f"{FRONTEND_URL}/superadmin-login" if role == "superadmin" else f"{FRONTEND_URL}/login"
    driver.get(login_url)

    email_input = wait_for_element(driver, By.XPATH, "//input[@type='email']")
    password_input = wait_for_element(driver, By.XPATH, "//input[@type='password']")
    submit_btn = wait_for_element(driver, By.XPATH, "//button[@type='submit']")

    if not all([email_input, password_input, submit_btn]):
        log(f"Could not find {role} login form elements.", "FAIL")
        return False

    email_input.send_keys(email)
    password_input.send_keys(password)
    submit_btn.click()

    try:
        # Wait up to 15 seconds for Next.js route compilation and redirection
        WebDriverWait(driver, 15).until(EC.url_contains(f"/{role}"))
        log(f"{role.capitalize()} logged in successfully.", "PASS")
        return True
    except TimeoutException:
        log(f"{role.capitalize()} login failed or didn't redirect appropriately. Current URL: {driver.current_url}", "FAIL")
        return False

def logout(driver):
    driver.execute_script("window.localStorage.clear(); window.sessionStorage.clear();")
    driver.delete_all_cookies()
    log("Cleared browser session for next role.", "INFO")
