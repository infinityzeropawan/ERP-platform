from core.utils import log, verify_page_loads, FRONTEND_URL
from core.auth import login, logout

def run_admin_tests(driver):
    log("SCHOOL ADMIN E2E FLOW", "SECTION", section=True)
    
    if not login(driver, "admin", "sch@greenwood.com", "schpass123"):
        log("Aborting Admin flows due to login failure.", "FAIL")
        return

    panels = [
        "attendance",
        "classes",
        "enrollment",
        "fee",
        "institutions",
        "messaging",
        "notices",
        "payroll",
        "reports",
        "settings",
        "timetable",
        "users"
    ]
    
    for panel in panels:
        path = f"/admin/{panel}"
        verify_page_loads(driver, path, panel)

    logout(driver)
