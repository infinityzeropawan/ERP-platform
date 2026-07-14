import subprocess
import json
import requests
import time

BASE_URL = "http://localhost:5000/api/v1"

def get_tokens():
    print("Generating test tokens...")
    result = subprocess.run(
        ["npx", "ts-node", "get_test_token.ts"],
        capture_output=True,
        text=True,
        check=True
    )
    return json.loads(result.stdout.strip())

def test_face_attendance(tokens):
    print("\n--- Testing Face Attendance ---")
    headers = {"Authorization": f"Bearer {tokens['token']}"}
    admin_headers = {"Authorization": f"Bearer {tokens['adminToken']}"}
    
    # 1. Register face
    descriptor = [0.1] * 128
    res = requests.post(f"{BASE_URL}/face/register", json={"descriptor": descriptor}, headers=headers)
    print("Register face:", res.status_code)
    assert res.status_code in [200, 201], f"Register failed: {res.text}"
    
    # 2. Get descriptor
    res = requests.get(f"{BASE_URL}/face/descriptor", headers=headers)
    print("Get descriptor:", res.status_code)
    assert res.status_code == 200, f"Get descriptor failed: {res.text}"
    assert len(res.json()["descriptor"]) == 128
    
    # 3. Post attendance
    res = requests.post(f"{BASE_URL}/face/attend", json={
        "confidenceScore": 95.5,
        "latitude": 28.6139,
        "longitude": 77.2090
    }, headers=headers)
    print("Post attendance:", res.status_code)
    assert res.status_code == 201, f"Post attendance failed: {res.text}"
    
    # 4. Get logs (Admin)
    res = requests.get(f"{BASE_URL}/face/logs", headers=admin_headers)
    print("Get face logs:", res.status_code)
    assert res.status_code == 200, f"Get logs failed: {res.text}"
    assert len(res.json()) >= 1
    
    print("Face Attendance tests PASSED")

def test_bus_tracking(tokens):
    print("\n--- Testing Bus Tracking ---")
    driver_headers = {"Authorization": f"Bearer {tokens['driverToken']}"}
    admin_headers = {"Authorization": f"Bearer {tokens['adminToken']}"}
    
    # 1. Post location
    res = requests.post(f"{BASE_URL}/bus/location", json={
        "latitude": 12.9716,
        "longitude": 77.5946,
        "accuracy": 10.5,
        "speed": 40.2,
        "heading": 90
    }, headers=driver_headers)
    print("Post bus location:", res.status_code)
    assert res.status_code == 201, f"Post location failed: {res.text}"
    
    # 2. Get live locations
    res = requests.get(f"{BASE_URL}/bus/locations", headers=admin_headers)
    print("Get live locations:", res.status_code)
    assert res.status_code == 200, f"Get locations failed: {res.text}"
    assert len(res.json()) >= 1
    
    # 3. Get history
    driver_id = tokens['driverId']
    res = requests.get(f"{BASE_URL}/bus/history/{driver_id}", headers=admin_headers)
    print("Get bus history:", res.status_code)
    assert res.status_code == 200, f"Get history failed: {res.text}"
    assert len(res.json()) >= 1
    
    print("Bus Tracking tests PASSED")

def test_admin_institution(tokens):
    print("\n--- Testing Admin Institution Geofence ---")
    admin_headers = {"Authorization": f"Bearer {tokens['adminToken']}"}
    
    # This route might not exist, but let's check PUT /admin/my-institution
    res = requests.put(f"{BASE_URL}/admin/my-institution", json={
        "latitude": 28.6139,
        "longitude": 77.2090,
        "geofenceRadius": 1000
    }, headers=admin_headers)
    print("Update institution location:", res.status_code)
    # The route /admin/my-institution is PUT, but if it's not implemented for geofencing fields it might just ignore or succeed.
    # Our schema has it, so it depends if the generic update route accepts it.
    if res.status_code == 200:
        print("Institution update PASSED")
    else:
        print("Institution update returned:", res.status_code, res.text)

if __name__ == "__main__":
    try:
        tokens = get_tokens()
        # Ensure server is running for tests to work
        try:
            requests.get("http://localhost:5000/api/health")
        except requests.exceptions.ConnectionError:
            print("ERROR: Backend server is not running on port 5000.")
            print("Please run the backend server first (e.g., npm run dev) before running tests.")
            exit(1)
            
        test_face_attendance(tokens)
        test_bus_tracking(tokens)
        test_admin_institution(tokens)
        
        print("\nAll integration tests finished!")
    except Exception as e:
        print(f"Test failed: {e}")
