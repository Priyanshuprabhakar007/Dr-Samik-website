/** Public diagnostic: reports deployment readiness without exposing credentials. */
export default {
  fetch(request: Request) {
    if (request.method !== 'GET') return Response.json({ error: 'Method not allowed' }, { status: 405 });
    const configured = !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON && !!process.env.ENQUIRY_RATE_LIMIT_SECRET;
    return Response.json(
      { service: 'Dr. Samik Sharma website API', status: configured ? 'ready' : 'configuration-required' },
      { status: configured ? 200 : 503, headers: { 'Cache-Control': 'no-store' } },
    );
  },
};
