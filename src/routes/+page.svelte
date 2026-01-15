<h1 class="text-2xl font-semibold mb-2">Mock Microsoft Graph Mail Service</h1>
<p class="text-sm text-gray-600 mb-6">
  This app mocks <code class="px-1 bg-gray-100 rounded">POST /v1.0/me/sendMail</code>,
  stores emails in D1, and provides UI for browsing and API testing.
</p>

<div class="grid gap-4 sm:grid-cols-3">
  <a href="/tester" class="card hover:shadow-md transition-shadow">
    <div class="card-title">API Tester</div>
    <div class="text-sm text-gray-600 mt-1">Compose and send a request.</div>
  </a>
  <a href="/mails" class="card hover:shadow-md transition-shadow">
    <div class="card-title">Sent Mails</div>
    <div class="text-sm text-gray-600 mt-1">Browse stored emails.</div>
  </a>
  <a href="/docs" class="card hover:shadow-md transition-shadow">
    <div class="card-title">API Docs</div>
    <div class="text-sm text-gray-600 mt-1">Request/response structure.</div>
  </a>
</div>
