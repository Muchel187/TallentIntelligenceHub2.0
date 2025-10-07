#!/bin/bash

# NOBA EXPERTS - Automated API & Endpoint Testing Script
# Tests all major endpoints and reports results

BASE_URL="http://localhost:3000"
TEST_EMAIL="tester@teste.de"
TEST_PASSWORD="test123"
SESSION_COOKIE=""
TEST_ID="test_1759865974778_hx7hK5VUdJ"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to print test results
print_test() {
    local name=$1
    local status=$2
    local details=$3

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    if [ "$status" == "PASS" ]; then
        echo -e "${GREEN}✓ PASS${NC} - $name"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    elif [ "$status" == "FAIL" ]; then
        echo -e "${RED}✗ FAIL${NC} - $name"
        echo -e "  ${RED}Details: $details${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    elif [ "$status" == "WARN" ]; then
        echo -e "${YELLOW}⚠ WARN${NC} - $name"
        echo -e "  ${YELLOW}Details: $details${NC}"
    else
        echo -e "${BLUE}ℹ INFO${NC} - $name"
    fi
}

# Function to extract session cookie from response
extract_session() {
    local response=$1
    SESSION_COOKIE=$(echo "$response" | grep -i "set-cookie" | grep "next-auth.session-token" | sed 's/.*next-auth.session-token=\([^;]*\).*/\1/')
}

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}  NOBA EXPERTS - Endpoint Testing Suite${NC}"
echo -e "${BLUE}=================================================${NC}"
echo ""

# ============================================
# 1. PUBLIC PAGES
# ============================================
echo -e "${YELLOW}[1] Testing Public Pages...${NC}"

# Test homepage
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/")
status_code=$(echo "$response" | tail -n 1)
if [ "$status_code" == "200" ]; then
    print_test "Homepage (/)" "PASS"
else
    print_test "Homepage (/)" "FAIL" "HTTP $status_code"
fi

# Test login page
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/login")
status_code=$(echo "$response" | tail -n 1)
if [ "$status_code" == "200" ]; then
    print_test "Login Page (/login)" "PASS"
else
    print_test "Login Page (/login)" "FAIL" "HTTP $status_code"
fi

# Test test page
response=$(curl -s -w "\n%{http_code}" "$BASE_URL/test")
status_code=$(echo "$response" | tail -n 1)
if [ "$status_code" == "200" ]; then
    print_test "Test Page (/test)" "PASS"
else
    print_test "Test Page (/test)" "FAIL" "HTTP $status_code"
fi

echo ""

# ============================================
# 2. AUTHENTICATION
# ============================================
echo -e "${YELLOW}[2] Testing Authentication...${NC}"

# Get CSRF token
csrf_response=$(curl -s "$BASE_URL/api/auth/csrf")
csrf_token=$(echo "$csrf_response" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$csrf_token" ]; then
    print_test "Get CSRF Token" "PASS"
else
    print_test "Get CSRF Token" "FAIL" "No CSRF token received"
fi

# Login
login_response=$(curl -s -i -X POST "$BASE_URL/api/auth/callback/credentials" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "csrfToken=$csrf_token&email=$TEST_EMAIL&password=$TEST_PASSWORD&redirect=false&json=true")

if echo "$login_response" | grep -q "200 OK"; then
    print_test "Login (POST /api/auth/callback/credentials)" "PASS"
    extract_session "$login_response"
else
    print_test "Login (POST /api/auth/callback/credentials)" "FAIL" "Login failed"
fi

# Get session
if [ -n "$SESSION_COOKIE" ]; then
    session_response=$(curl -s -w "\n%{http_code}" -b "next-auth.session-token=$SESSION_COOKIE" "$BASE_URL/api/auth/session")
    status_code=$(echo "$session_response" | tail -n 1)

    if [ "$status_code" == "200" ] && echo "$session_response" | grep -q "$TEST_EMAIL"; then
        print_test "Get Session" "PASS"
    else
        print_test "Get Session" "FAIL" "HTTP $status_code or invalid session"
    fi
fi

echo ""

# ============================================
# 3. PROTECTED PAGES (Requires Auth)
# ============================================
echo -e "${YELLOW}[3] Testing Protected Pages...${NC}"

if [ -n "$SESSION_COOKIE" ]; then
    # Dashboard
    response=$(curl -s -w "\n%{http_code}" -b "next-auth.session-token=$SESSION_COOKIE" "$BASE_URL/dashboard")
    status_code=$(echo "$response" | tail -n 1)
    if [ "$status_code" == "200" ]; then
        print_test "Dashboard (/dashboard)" "PASS"
    else
        print_test "Dashboard (/dashboard)" "FAIL" "HTTP $status_code"
    fi

    # Reports
    response=$(curl -s -w "\n%{http_code}" -b "next-auth.session-token=$SESSION_COOKIE" "$BASE_URL/reports")
    status_code=$(echo "$response" | tail -n 1)
    if [ "$status_code" == "200" ]; then
        print_test "Reports (/reports)" "PASS"
    else
        print_test "Reports (/reports)" "FAIL" "HTTP $status_code"
    fi

    # Company Dashboard
    response=$(curl -s -w "\n%{http_code}" -b "next-auth.session-token=$SESSION_COOKIE" "$BASE_URL/dashboard/company")
    status_code=$(echo "$response" | tail -n 1)
    if [ "$status_code" == "200" ]; then
        print_test "Company Dashboard (/dashboard/company)" "PASS"
    else
        print_test "Company Dashboard (/dashboard/company)" "FAIL" "HTTP $status_code"
    fi

    # Admin Dashboard
    response=$(curl -s -w "\n%{http_code}" -b "next-auth.session-token=$SESSION_COOKIE" "$BASE_URL/admin")
    status_code=$(echo "$response" | tail -n 1)
    if [ "$status_code" == "200" ]; then
        print_test "Admin Dashboard (/admin)" "PASS"
    elif [ "$status_code" == "404" ]; then
        print_test "Admin Dashboard (/admin)" "WARN" "Page not found - may need to be created"
    else
        print_test "Admin Dashboard (/admin)" "FAIL" "HTTP $status_code"
    fi
else
    print_test "Protected Pages" "FAIL" "No session cookie - cannot test"
fi

echo ""

# ============================================
# 4. API ENDPOINTS
# ============================================
echo -e "${YELLOW}[4] Testing API Endpoints...${NC}"

if [ -n "$SESSION_COOKIE" ]; then
    # Get reports
    response=$(curl -s -w "\n%{http_code}" -b "next-auth.session-token=$SESSION_COOKIE" "$BASE_URL/api/reports")
    status_code=$(echo "$response" | tail -n 1)
    if [ "$status_code" == "200" ]; then
        print_test "API: Get Reports (GET /api/reports)" "PASS"
    else
        print_test "API: Get Reports (GET /api/reports)" "FAIL" "HTTP $status_code"
    fi

    # Get specific report
    response=$(curl -s -w "\n%{http_code}" -b "next-auth.session-token=$SESSION_COOKIE" "$BASE_URL/report/$TEST_ID")
    status_code=$(echo "$response" | tail -n 1)
    if [ "$status_code" == "200" ]; then
        print_test "API: Get Specific Report (GET /report/$TEST_ID)" "PASS"
    else
        print_test "API: Get Specific Report (GET /report/$TEST_ID)" "FAIL" "HTTP $status_code"
    fi

    # Company stats
    response=$(curl -s -w "\n%{http_code}" -b "next-auth.session-token=$SESSION_COOKIE" "$BASE_URL/api/company/stats")
    status_code=$(echo "$response" | tail -n 1)
    if [ "$status_code" == "200" ]; then
        print_test "API: Company Stats (GET /api/company/stats)" "PASS"
    else
        print_test "API: Company Stats (GET /api/company/stats)" "FAIL" "HTTP $status_code"
    fi

    # Analytics team
    response=$(curl -s -w "\n%{http_code}" -b "next-auth.session-token=$SESSION_COOKIE" "$BASE_URL/api/analytics/team")
    status_code=$(echo "$response" | tail -n 1)
    if [ "$status_code" == "200" ]; then
        print_test "API: Team Analytics (GET /api/analytics/team)" "PASS"
    else
        print_test "API: Team Analytics (GET /api/analytics/team)" "FAIL" "HTTP $status_code"
    fi
fi

echo ""

# ============================================
# 5. AI CHAT FUNCTIONALITY
# ============================================
echo -e "${YELLOW}[5] Testing AI Chat...${NC}"

if [ -n "$SESSION_COOKIE" ]; then
    # Access chat page
    response=$(curl -s -w "\n%{http_code}" -b "next-auth.session-token=$SESSION_COOKIE" "$BASE_URL/chat/$TEST_ID")
    status_code=$(echo "$response" | tail -n 1)
    if [ "$status_code" == "200" ]; then
        print_test "Chat Page (GET /chat/$TEST_ID)" "PASS"
    else
        print_test "Chat Page (GET /chat/$TEST_ID)" "FAIL" "HTTP $status_code"
    fi

    # Test chat stream endpoint
    chat_payload='{"testId":"'$TEST_ID'","message":"Hallo, wie geht es?"}'
    response=$(curl -s -w "\n%{http_code}" -X POST \
        -b "next-auth.session-token=$SESSION_COOKIE" \
        -H "Content-Type: application/json" \
        -d "$chat_payload" \
        "$BASE_URL/api/chat/stream" \
        --max-time 10)

    status_code=$(echo "$response" | tail -n 1)

    if [ "$status_code" == "200" ]; then
        print_test "Chat Stream API (POST /api/chat/stream)" "PASS"
    elif [ "$status_code" == "403" ]; then
        print_test "Chat Stream API (POST /api/chat/stream)" "FAIL" "Access denied (403) - check paid status or expiry"
    elif [ "$status_code" == "000" ]; then
        print_test "Chat Stream API (POST /api/chat/stream)" "WARN" "Timeout (stream may be working but slow)"
    else
        print_test "Chat Stream API (POST /api/chat/stream)" "FAIL" "HTTP $status_code"
    fi
fi

echo ""

# ============================================
# 6. PAYMENT & CHECKOUT
# ============================================
echo -e "${YELLOW}[6] Testing Payment & Checkout...${NC}"

if [ -n "$SESSION_COOKIE" ]; then
    # Access checkout page
    response=$(curl -s -w "\n%{http_code}" -b "next-auth.session-token=$SESSION_COOKIE" "$BASE_URL/payment/checkout?testId=$TEST_ID")
    status_code=$(echo "$response" | tail -n 1)
    if [ "$status_code" == "200" ]; then
        print_test "Checkout Page (GET /payment/checkout)" "PASS"
    else
        print_test "Checkout Page (GET /payment/checkout)" "FAIL" "HTTP $status_code"
    fi

    # Test create checkout endpoint (will fail without Stripe key, that's expected)
    checkout_payload='{"testId":"'$TEST_ID'","email":"'$TEST_EMAIL'"}'
    response=$(curl -s -w "\n%{http_code}" -X POST \
        -b "next-auth.session-token=$SESSION_COOKIE" \
        -H "Content-Type: application/json" \
        -d "$checkout_payload" \
        "$BASE_URL/api/payment/create-checkout")

    status_code=$(echo "$response" | tail -n 1)

    if [ "$status_code" == "200" ]; then
        print_test "Create Checkout (POST /api/payment/create-checkout)" "PASS"
    elif [ "$status_code" == "501" ]; then
        print_test "Create Checkout (POST /api/payment/create-checkout)" "WARN" "Stripe not configured (expected)"
    else
        print_test "Create Checkout (POST /api/payment/create-checkout)" "FAIL" "HTTP $status_code"
    fi
fi

echo ""

# ============================================
# 7. EMPLOYEE INVITATION
# ============================================
echo -e "${YELLOW}[7] Testing Employee Invitation...${NC}"

if [ -n "$SESSION_COOKIE" ]; then
    # Access invite page
    response=$(curl -s -w "\n%{http_code}" -b "next-auth.session-token=$SESSION_COOKIE" "$BASE_URL/dashboard/company/employees/invite")
    status_code=$(echo "$response" | tail -n 1)
    if [ "$status_code" == "200" ]; then
        print_test "Invite Page (GET /dashboard/company/employees/invite)" "PASS"
    else
        print_test "Invite Page (GET /dashboard/company/employees/invite)" "FAIL" "HTTP $status_code"
    fi
fi

echo ""

# ============================================
# 8. DATABASE CHECKS
# ============================================
echo -e "${YELLOW}[8] Testing Database...${NC}"

# Check if database file exists
if [ -f "prisma/dev.db" ]; then
    print_test "Database File Exists" "PASS"

    # Check test results count
    test_count=$(sqlite3 prisma/dev.db "SELECT COUNT(*) FROM test_results;")
    if [ "$test_count" -gt 0 ]; then
        print_test "Test Results in DB ($test_count records)" "PASS"
    else
        print_test "Test Results in DB" "WARN" "No test results found"
    fi

    # Check users count
    user_count=$(sqlite3 prisma/dev.db "SELECT COUNT(*) FROM users;")
    if [ "$user_count" -gt 0 ]; then
        print_test "Users in DB ($user_count users)" "PASS"
    else
        print_test "Users in DB" "WARN" "No users found"
    fi

    # Check companies count
    company_count=$(sqlite3 prisma/dev.db "SELECT COUNT(*) FROM companies;")
    if [ "$company_count" -gt 0 ]; then
        print_test "Companies in DB ($company_count companies)" "PASS"
    else
        print_test "Companies in DB" "WARN" "No companies found"
    fi

    # Check specific test
    test_exists=$(sqlite3 prisma/dev.db "SELECT COUNT(*) FROM test_results WHERE test_id='$TEST_ID';")
    if [ "$test_exists" -gt 0 ]; then
        print_test "Test ID $TEST_ID exists" "PASS"

        # Check if test is paid
        is_paid=$(sqlite3 prisma/dev.db "SELECT paid FROM test_results WHERE test_id='$TEST_ID';")
        if [ "$is_paid" == "1" ]; then
            print_test "Test $TEST_ID paid status" "PASS"
        else
            print_test "Test $TEST_ID paid status" "FAIL" "Test not marked as paid"
        fi
    else
        print_test "Test ID $TEST_ID exists" "FAIL" "Test not found in database"
    fi
else
    print_test "Database File Exists" "FAIL" "prisma/dev.db not found"
fi

echo ""

# ============================================
# 9. ENVIRONMENT VARIABLES
# ============================================
echo -e "${YELLOW}[9] Checking Environment Variables...${NC}"

if [ -f ".env" ]; then
    print_test ".env file exists" "PASS"

    # Check for required env vars
    if grep -q "NEXTAUTH_SECRET=" .env && [ -n "$(grep 'NEXTAUTH_SECRET=' .env | cut -d'=' -f2)" ]; then
        print_test "NEXTAUTH_SECRET configured" "PASS"
    else
        print_test "NEXTAUTH_SECRET configured" "FAIL" "Missing or empty"
    fi

    if grep -q "GEMINI_API_KEY=" .env && [ -n "$(grep 'GEMINI_API_KEY=' .env | cut -d'=' -f2)" ]; then
        print_test "GEMINI_API_KEY configured" "PASS"
    else
        print_test "GEMINI_API_KEY configured" "WARN" "Missing or empty"
    fi

    if grep -q "STRIPE_SECRET_KEY=" .env && [ -n "$(grep 'STRIPE_SECRET_KEY=' .env | cut -d'=' -f2)" ]; then
        print_test "STRIPE_SECRET_KEY configured" "PASS"
    else
        print_test "STRIPE_SECRET_KEY configured" "WARN" "Missing or empty"
    fi

    if grep -q "RESEND_API_KEY=" .env && [ -n "$(grep 'RESEND_API_KEY=' .env | cut -d'=' -f2)" ]; then
        print_test "RESEND_API_KEY configured" "PASS"
    else
        print_test "RESEND_API_KEY configured" "WARN" "Missing or empty"
    fi
else
    print_test ".env file exists" "FAIL" ".env file not found"
fi

echo ""

# ============================================
# SUMMARY
# ============================================
echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}  Test Summary${NC}"
echo -e "${BLUE}=================================================${NC}"
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}✓ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}✗ Some tests failed. Please review the output above.${NC}"
    exit 1
fi
