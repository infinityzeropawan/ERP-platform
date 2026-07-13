import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from core.utils import init_report, log
from flows.superadmin_flow import run_superadmin_tests
from flows.admin_flow import run_admin_tests
from flows.teacher_flow import run_teacher_tests
from flows.student_flow import run_student_tests

def e2e_test_suite():
    init_report()
    log("Starting Comprehensive Selenium E2E Suite (60 Panels)", "INFO")
    
    options = webdriver.ChromeOptions()
    options.add_argument('--headless=new') 
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--host-resolver-rules="MAP buildroonix.com 222.167.207.105, MAP www.buildroonix.com 222.167.207.105"')
    options.add_argument('--ignore-certificate-errors')
    
    driver = None
    try:
        driver = webdriver.Chrome(service=Service(executable_path="/home/pawan/.wdm/drivers/chromedriver/linux64/146.0.7680.165/chromedriver-linux64/chromedriver"), options=options)
        driver.implicitly_wait(5)
    except Exception as e:
        log(f"Failed to initialize WebDriver: {e}", "FAIL")
        return

    try:
        run_superadmin_tests(driver)
        run_admin_tests(driver)
        run_teacher_tests(driver)
        run_student_tests(driver)
    except Exception as e:
        log(f"Test suite encountered an unexpected global error: {e}", "FAIL")
    finally:
        log("COMPLETED FULL E2E SUITE", "SECTION", section=True)
        time.sleep(2)
        if driver:
            driver.quit()

if __name__ == "__main__":
    e2e_test_suite()
