const http = require('http');

const BASE_URL = 'http://localhost:3000';

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const req = http.get(`${BASE_URL}${path}`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

async function testAPI() {
  console.log('Testing Image Processing API with Database...\n');

  try {
    // Test root endpoint
    console.log('1. Testing root endpoint...');
    const rootResponse = await makeRequest('/');
    console.log(`Status: ${rootResponse.status}`);
    console.log('Response:', JSON.stringify(rootResponse.data, null, 2));
    console.log('');

    // Test API info endpoint
    console.log('2. Testing API info endpoint...');
    const apiInfoResponse = await makeRequest('/api/images');
    console.log(`Status: ${apiInfoResponse.status}`);
    console.log('Response:', JSON.stringify(apiInfoResponse.data, null, 2));
    console.log('');

    // Test database endpoints
    console.log('3. Testing database endpoints...');

    // Test list images endpoint
    console.log('  3a. Testing list images endpoint...');
    const listResponse = await makeRequest('/api/images/list');
    console.log(`   Status: ${listResponse.status}`);
    console.log('   Response:', JSON.stringify(listResponse.data, null, 2));
    console.log('');

    // Test logs endpoint
    console.log('  3b. Testing logs endpoint...');
    const logsResponse = await makeRequest('/api/images/logs?limit=5');
    console.log(`   Status: ${logsResponse.status}`);
    console.log('   Response:', JSON.stringify(logsResponse.data, null, 2));
    console.log('');

    // Test image validation
    console.log('4. Testing image validation...');
    const validateResponse = await makeRequest(
      '/api/images/validate?filename=sample1.jpg',
    );
    console.log(`Status: ${validateResponse.status}`);
    console.log('Response:', JSON.stringify(validateResponse.data, null, 2));
    console.log('');

    // Test image resize
    console.log('5. Testing image resize...');
    const resizeResponse = await makeRequest(
      '/api/images/resize?filename=sample1.jpg&width=300&height=200',
    );
    console.log(`Status: ${resizeResponse.status}`);
    console.log('Response:', JSON.stringify(resizeResponse.data, null, 2));
    console.log('');

    // Test error case - missing parameters
    console.log('6. Testing error case (missing parameters)...');
    const errorResponse = await makeRequest(
      '/api/images/resize?filename=sample1.jpg',
    );
    console.log(`Status: ${errorResponse.status}`);
    console.log('Response:', JSON.stringify(errorResponse.data, null, 2));
    console.log('');

    console.log('API testing completed!');
  } catch (error) {
    console.error('Error testing API:', error.message);
    console.log('Make sure the server is running on http://localhost:3000');
  }
}

testAPI();
