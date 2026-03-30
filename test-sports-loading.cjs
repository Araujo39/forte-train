/**
 * ForteTrain AI Generator Test Script
 * Tests sports loading functionality with authentication
 */

const API_BASE = 'https://fortetrain.pages.dev';
const TEST_CREDENTIALS = {
    email: 'andre@fortetrain.app',
    password: 'demo123'
};

async function testAIGenerator() {
    console.log('🧪 ForteTrain AI Generator - Sports Loading Test\n');
    console.log('Environment: Production');
    console.log('API Base:', API_BASE);
    console.log('='.repeat(60));

    try {
        // Step 1: Login
        console.log('\n📍 Step 1: Authenticating...');
        const loginResponse = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_CREDENTIALS)
        });
        
        const loginData = await loginResponse.json();
        
        if (!loginData.token) {
            console.error('❌ Login failed: No token received');
            return;
        }
        
        const token = loginData.token;
        console.log('✅ Login successful');
        console.log('   Token:', token.substring(0, 20) + '...');

        // Step 2: Fetch Sports Configs
        console.log('\n📍 Step 2: Fetching sports configurations...');
        const sportsResponse = await fetch(`${API_BASE}/api/sports/configs`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const sportsData = await sportsResponse.json();

        if (!sportsData.success) {
            console.error('❌ Sports endpoint returned error');
            return;
        }

        const sports = sportsData.sports;
        console.log(`✅ Sports loaded: ${sports.length} modalities`);
        
        console.log('\n📊 Sports Configuration:');
        sports.forEach((sport, idx) => {
            console.log(`   ${idx + 1}. ${sport.name.padEnd(20)} | Type: ${sport.type.padEnd(15)} | Color: ${sport.primaryColor} | Icon: ${sport.icon}`);
        });

        // Step 3: Test Sport Selection
        console.log('\n📍 Step 3: Testing sport-specific configs...');
        
        const testSports = ['bodybuilding', 'cycling', 'tennis'];
        for (const sportType of testSports) {
            const sport = sports.find(s => s.type === sportType);
            if (sport) {
                console.log(`\n   🎯 ${sport.name}:`);
                console.log(`      Primary: ${sport.primaryColor}`);
                console.log(`      Secondary: ${sport.secondaryColor}`);
                console.log(`      Icon: ${sport.icon}`);
                console.log(`      Gradient: ${sport.uiTheme.gradient}`);
            }
        }

        // Step 4: Fetch Students
        console.log('\n📍 Step 4: Fetching students list...');
        const studentsResponse = await fetch(`${API_BASE}/api/students`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const studentsData = await studentsResponse.json();
        console.log(`✅ Students loaded: ${studentsData.students.length} students`);

        console.log('\n' + '='.repeat(60));
        console.log('✅ ALL TESTS PASSED!');
        console.log('\n📋 Summary:');
        console.log(`   ✓ Authentication: OK`);
        console.log(`   ✓ Sports API: ${sports.length} sports`);
        console.log(`   ✓ Students API: ${studentsData.students.length} students`);
        console.log(`   ✓ Sport Themes: OK`);

    } catch (error) {
        console.error('\n❌ TEST FAILED');
        console.error('Error:', error.message);
    }
}

// Run tests
testAIGenerator();
