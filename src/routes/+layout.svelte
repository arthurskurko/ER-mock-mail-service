<script lang="ts">
  import '../app.css';
</script>

<div class="min-h-screen bg-gray-50 text-gray-900">
  <header class="border-b bg-white">
    <div class="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
      <a href="/" class="font-semibold">Mock Graph Mail</a>
      <nav class="flex gap-4 text-sm">
        <a class="hover:underline" href="/mails">Mails</a>
        <a class="hover:underline" href="/send">Send Email</a>
        <a class="hover:underline" href="/tester">API Tester</a>
        <a class="hover:underline" href="/docs">Docs</a>
      </nav>
    </div>
  </header>

  <main class="mx-auto max-w-5xl px-4 py-6">
    <slot />
  </main>
</div>
