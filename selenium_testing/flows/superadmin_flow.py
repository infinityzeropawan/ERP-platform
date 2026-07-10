from core.utils import log, verify_page_loads, FRONTEND_URL
from core.auth import login, logout

def run_superadmin_tests(driver):
    log("SUPERADMIN E2E FLOW", "SECTION", section=True)
    
    if not login(driver, "superadmin", "superadmin@buildroonix.com", "super123"):
        log("Aborting Superadmin flows due to login failure.", "FAIL")
        return

    panels = [
        "announcements",
        "billing",
        "institutions",
        "modules",
        "settings"
    ]
    
    for panel in panels:
        path = f"/superadmin/{panel}"
        verify_page_loads(driver, path, panel)

    logout(driver)
