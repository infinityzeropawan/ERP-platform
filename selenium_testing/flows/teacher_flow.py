from core.utils import log, verify_page_loads, FRONTEND_URL
from core.auth import login, logout

def run_teacher_tests(driver):
    log("TEACHER E2E FLOW", "SECTION", section=True)
    
    if not login(driver, "teacher", "pawankumar@school.com", "pawankumar123"):
        log("Aborting Teacher flows due to login failure.", "FAIL")
        return

    panels = [
        "ai-notes",
        "assignments",
        "attendance",
        "daily-diary",
        "docs",
        "exams",
        "gradebook",
        "leave",
        "lesson-plans",
        "messaging",
        "online-classes",
        "online-exams",
        "parent-communication",
        "payroll",
        "previous-papers",
        "profile",
        "student-attendance",
        "students",
        "study-material",
        "syllabus",
        "timetable"
    ]
    
    for panel in panels:
        path = f"/teacher/{panel}"
        verify_page_loads(driver, path, panel)

    logout(driver)
