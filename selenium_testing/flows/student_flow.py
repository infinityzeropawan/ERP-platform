from core.utils import log, verify_page_loads, FRONTEND_URL
from core.auth import login, logout

def run_student_tests(driver):
    log("STUDENT E2E FLOW", "SECTION", section=True)
    
    if not login(driver, "student", "aman@school.com", "aman123"):
        log("Aborting Student flows due to login failure.", "FAIL")
        return

    panels = [
        "ai-notes",
        "assignments",
        "attendance",
        "certificates",
        "doubts",
        "exams",
        "fee",
        "feedback",
        "leave",
        "messaging",
        "my-class",
        "notices",
        "notifications",
        "online-classes",
        "online-exams",
        "previous-papers",
        "profile",
        "report-card",
        "results",
        "study-material",
        "syllabus",
        "timetable"
    ]
    
    for panel in panels:
        path = f"/student/{panel}"
        verify_page_loads(driver, path, panel)

    logout(driver)
