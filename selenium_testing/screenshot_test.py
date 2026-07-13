import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

options = webdriver.ChromeOptions()
options.add_argument('--headless=new')
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
options.add_argument('--window-size=1920,1080')
options.add_argument('--host-resolver-rules="MAP buildroonix.com 222.167.207.105, MAP www.buildroonix.com 222.167.207.105"')
options.add_argument('--ignore-certificate-errors')

driver = webdriver.Chrome(service=Service("/home/pawan/.wdm/drivers/chromedriver/linux64/146.0.7680.165/chromedriver-linux64/chromedriver"), options=options)

print("Navigating to /superadmin-login...")
driver.get("https://buildroonix.com/superadmin-login")
time.sleep(3)
driver.save_screenshot("/home/pawan/.gemini/antigravity-ide/brain/cea4fe02-5967-4c37-99fa-6f966f39da43/superadmin_login.png")

print("Navigating to /login...")
driver.get("https://buildroonix.com/login")
time.sleep(3)
driver.save_screenshot("/home/pawan/.gemini/antigravity-ide/brain/cea4fe02-5967-4c37-99fa-6f966f39da43/login.png")

driver.quit()
print("Screenshots saved!")
