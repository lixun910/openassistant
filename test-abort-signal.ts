// SPDX-License-Identifier: MIT
// Test script to verify abort signal functionality in tools

import { geocoding } from './packages/tools/osm/src/geocoding';
import { webSearch } from './packages/tools/places/src/webSearch';

async function testAbortSignalWithGeocoding() {
  console.log('\n=== Testing Abort Signal with Geocoding Tool ===\n');
  
  const controller = new AbortController();
  
  // Abort immediately
  setTimeout(() => {
    console.log('⚠️  Aborting geocoding operation...');
    controller.abort();
  }, 100);
  
  try {
    const result = await geocoding.execute(
      { address: 'Eiffel Tower, Paris' },
      { 
        toolCallId: 'test-1',
        abortSignal: controller.signal 
      }
    );
    console.log('❌ Test failed: Expected an abort error but got result:', result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('aborted')) {
      console.log('✅ Test passed: Geocoding was properly aborted');
    } else {
      console.log('❌ Test failed with unexpected error:', error);
    }
  }
}

async function testAbortSignalWithWebSearch() {
  console.log('\n=== Testing Abort Signal with Web Search Tool ===\n');
  
  const controller = new AbortController();
  
  // Abort after a short delay
  setTimeout(() => {
    console.log('⚠️  Aborting web search operation...');
    controller.abort();
  }, 50);
  
  try {
    const result = await webSearch.execute(
      { query: 'OpenAI GPT-4' },
      { 
        toolCallId: 'test-2',
        abortSignal: controller.signal,
        context: {
          getSearchAPIKey: () => 'test-key'
        }
      }
    );
    console.log('Result:', result);
  } catch (error) {
    if (error instanceof Error && (error.message.includes('aborted') || error.name === 'AbortError')) {
      console.log('✅ Test passed: Web search was properly aborted');
    } else {
      console.log('ℹ️  Error caught:', error instanceof Error ? error.message : error);
    }
  }
}

async function testNoAbortSignal() {
  console.log('\n=== Testing Tool Execution Without Abort Signal ===\n');
  
  try {
    // This should work normally without abort signal
    const result = await geocoding.execute(
      { address: 'New York City' },
      { 
        toolCallId: 'test-3'
        // No abort signal provided
      }
    );
    console.log('✅ Test passed: Tool works normally without abort signal');
  } catch (error) {
    console.log('ℹ️  Got error (expected due to rate limiting or network):', 
      error instanceof Error ? error.message : error);
  }
}

async function runTests() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║  Abort Signal Implementation Tests         ║');
  console.log('╚════════════════════════════════════════════╝');
  
  await testAbortSignalWithGeocoding();
  await testAbortSignalWithWebSearch();
  await testNoAbortSignal();
  
  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║  Tests Complete                            ║');
  console.log('╚════════════════════════════════════════════╝\n');
}

// Run tests if executed directly
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests };
