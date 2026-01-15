<script lang="ts">
  const example = `{
  "message": {
    "subject": "Hello",
    "body": { "contentType": "Text", "content": "Hi!" },
    "toRecipients": [
      { "emailAddress": { "address": "person@example.com", "name": "Optional Name" } }
    ],
    "ccRecipients": [],
    "bccRecipients": [],
    "clientMessageId": "optional-client-id"
  },
  "saveToSentItems": true
}`;
</script>

<h1 class="text-xl font-semibold mb-4">Mock API Documentation</h1>

<div class="card space-y-4 text-sm">
  <div>
    <div class="card-title">Endpoint</div>
    <pre class="mt-2 rounded-lg bg-gray-50 p-3 text-xs">POST /v1.0/me/sendMail</pre>
  </div>

  <div>
    <div class="card-title">Request (simplified Graph-like)</div>
    <pre class="mt-2 rounded-lg bg-gray-50 p-3 text-xs whitespace-pre-wrap">{example}</pre>
  </div>

  <div>
    <div class="card-title">Response</div>
    <ul class="list-disc pl-5 text-gray-700">
      <li>Success: <code>202 Accepted</code>, empty body, <code>Location: /mails/:id</code></li>
      <li>Validation error: <code>400</code> JSON with <code>error</code> + <code>issues</code></li>
    </ul>
  </div>
</div>
