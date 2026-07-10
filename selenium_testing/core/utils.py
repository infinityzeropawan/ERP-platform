import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, NoSuchElementException
from colorama import Fore, Style

REPORT_FILE = "test_report.md"
FRONTEND_URL = "http://localhost:3000"

def init_report():
    with open(REPORT_FILE, "w") as f:
        f.write("# Buildroonix ERP - End-to-End Comprehensive UI Test Report\n\n")
        f.write("> 🤖 Automated test report covering all 60 application panels across 4 distinct user roles.\n\n")

def log(msg, status="INFO", section=False):
    colors = {
        "INFO": Fore.CYAN,
        "PASS": Fore.GREEN,
        "FAIL": Fore.RED,
        "WARN": Fore.YELLOW,
        "SECTION": Fore.MAGENTA
    }
    color = colors.get(status, Fore.WHITE)
    print(f"{color}[{status}] {msg}{Style.RESET_ALL}")
    
    with open(REPORT_FILE, "a") as f:
        if section:
            f.write(f"\n## {msg}\n")
        elif status == "PASS":
            f.write(f"- ✅ **PASS**: {msg}\n")
        elif status == "FAIL":
            f.write(f"- ❌ **FAIL**: {msg}\n")
        elif status == "INFO":
            f.write(f"### {msg}\n")
        else:
            f.write(f"- ⚠️ **{status}**: {msg}\n")

def wait_for_element(driver, by, value, timeout=20):
    try:
        return WebDriverWait(driver, timeout).until(
            EC.presence_of_element_located((by, value))
        )
    except TimeoutException:
        return None

def click_element(driver, by, value, timeout=20):
    try:
        element = WebDriverWait(driver, timeout).until(
            EC.element_to_be_clickable((by, value))
        )
        element.click()
        return True
    except TimeoutException:
        return False

def verify_page_loads(driver, target_path, panel_name):
    """
    Verifies that a page loads by clicking its sidebar link to maintain SPA context.
    target_path should be relative like '/superadmin/announcements'
    """
    # Find the link in the sidebar that matches the target path exactly
    xpath = f"//a[@href='{target_path}']"
    
    if not click_element(driver, By.XPATH, xpath):
        log(f"Panel '{panel_name}' link not found in sidebar or not clickable.", "WARN")
        return False
        
    time.sleep(1.5) # Wait for Next.js client-side rendering transition
    
    current_url = driver.current_url
    if not current_url.endswith(target_path):
        log(f"Panel '{panel_name}' clicked but URL is {current_url} instead of {target_path}.", "FAIL")
        return False
        
    page_source = driver.page_source.lower()
    if "404 - page not found" in page_source or "application error" in page_source:
        log(f"Panel '{panel_name}' failed to render correctly (404/Error).", "FAIL")
        return False
        
    log(f"Panel '{panel_name}' rendered successfully.", "PASS")
    return True
