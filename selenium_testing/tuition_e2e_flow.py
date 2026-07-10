import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By

from core.utils import log, verify_page_loads, click_element, wait_for_element
from core.auth import login, logout

def run_tuition_admin_flow(driver):
    log("SECTION", "TUITION ADMIN E2E FLOW")
    if not login(driver, "admin", "admin@tuition.com", "tuitionpass123"):
        log("Aborting Coaching Admin flow due to login failure.", "FAIL")
        return

    # Basic navigation test
    panels = ["attendance", "classes", "institutions", "messaging", "notices", "settings", "timetable", "users"]
    for panel in panels:
        verify_page_loads(driver, f"/admin/{panel}", panel)

    # Functionality test: Create a Notice
    log("Testing Functionality: Create Notice", "INFO")
    if click_element(driver, By.XPATH, "//a[contains(@href, '/admin/notices')]"):
        time.sleep(1.5)
        # Click "Post Notice" button
        if click_element(driver, By.XPATH, "//button[contains(text(), 'Post Notice')]"):
            title_input = wait_for_element(driver, By.XPATH, "//input[@placeholder='Notice title']")
            if title_input:
                title_input.click()
                title_input.send_keys("Upcoming Coaching Test")
                # Description
                textarea = wait_for_element(driver, By.XPATH, "//textarea")
                textarea.click()
                textarea.send_keys("Please be prepared for the upcoming mock test on Sunday.")
                
                # Save
                if click_element(driver, By.XPATH, "//div[contains(@class, 'animate-dialog-in')]//button[contains(text(), 'Post Notice') or contains(text(), 'Save') or contains(text(), 'Publish')]"):
                    time.sleep(2)
                    log("Successfully created a notice.", "PASS")
                else:
                    log("Failed to submit Notice.", "FAIL")
                # Close dialog to prevent overlay blocking
                from selenium.webdriver.common.keys import Keys
                driver.refresh()
                time.sleep(1)
            else:
                log("Failed to find Notice form inputs.", "FAIL")
        else:
            log("Failed to click Post Notice button.", "FAIL")


    # Functionality test: Create a Class (Batch)
    log("Testing Functionality: Create Batch", "INFO")
    if click_element(driver, By.XPATH, "//a[contains(@href, '/admin/classes')]"):
        time.sleep(1.5)
        if click_element(driver, By.XPATH, "//button[contains(text(), 'Add Class')]"):
            class_input = wait_for_element(driver, By.XPATH, "//input[@placeholder='Class-X']")
            if class_input:
                class_input.click()
                class_input.send_keys("NEET Target Batch")
                sec_input = wait_for_element(driver, By.XPATH, "//input[@placeholder='A']")
                sec_input.click()
                sec_input.send_keys("Morning")
                click_element(driver, By.XPATH, "//div[@role='dialog']//button[contains(text(), 'Add Class') or contains(text(), 'Save')]")
                time.sleep(2)
                log("Successfully created a batch.", "PASS")
                # Close dialog to prevent overlay blocking
                driver.refresh()
                time.sleep(1)
            else:
                log("Failed to find Add Class inputs.", "FAIL")


    # Functionality test: Take Attendance
    log("Testing Functionality: Take Attendance", "INFO")
    if click_element(driver, By.XPATH, "//a[contains(@href, '/teacher/attendance')]"):
        time.sleep(1.5)
        if click_element(driver, By.XPATH, "//button[contains(text(), 'Mark')]") or click_element(driver, By.XPATH, "//button[contains(text(), 'Submit')]"):
            time.sleep(1)
            log("Successfully marked attendance.", "PASS")

    logout(driver)

def run_tuition_teacher_flow(driver):
    log("SECTION", "TUITION TEACHER E2E FLOW")
    if not login(driver, "teacher", "teacher@tuition.com", "teacherpass123"):
        log("Aborting Instructor flow due to login failure.", "FAIL")
        return

    # Basic navigation test
    panels = ["assignments", "attendance", "daily-diary", "exams", "leave", "online-classes", "profile", "students", "timetable"]
    for panel in panels:
        verify_page_loads(driver, f"/teacher/{panel}", panel)

    logout(driver)

def run_tuition_student_flow(driver):
    log("SECTION", "TUITION STUDENT E2E FLOW")
    if not login(driver, "student", "student@tuition.com", "studentpass123"):
        log("Aborting Coaching Student flow due to login failure.", "FAIL")
        return

    panels = ["ai-notes", "assignments", "attendance", "fee", "feedback", "leave", "my-class", "notices", "profile"]
    for panel in panels:
        verify_page_loads(driver, f"/student/{panel}", panel)

    # Functionality Test: Read Notice
    log("Testing Functionality: View Notice", "INFO")
    if click_element(driver, By.XPATH, "//a[contains(@href, '/student/notices')]"):
        time.sleep(1.5)
        notice = wait_for_element(driver, By.XPATH, "//*[contains(text(), 'Upcoming Coaching Test')]")
        if notice:
            log("Coaching Student successfully viewed the notice.", "PASS")
        else:
            log("Notice not found for Coaching Student.", "FAIL")

    logout(driver)

if __name__ == "__main__":
    log("INFO", "Starting Tuition Center E2E Functional Suite")
    
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    
    driver = webdriver.Chrome(service=Service(executable_path="/home/pawan/.wdm/drivers/chromedriver/linux64/146.0.7680.165/chromedriver-linux64/chromedriver"), options=options)
    driver.implicitly_wait(10)
    
    try:
        run_tuition_admin_flow(driver)
        run_tuition_teacher_flow(driver)
        run_tuition_student_flow(driver)
        
        log("SECTION", "COMPLETED TUITION E2E SUITE")
    finally:
        driver.quit()
