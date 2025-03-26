<div class="internal-docs-layout">
  <header class="internal-docs-header">
    <h1>Internal Developer Documentation</h1>
    <div class="developer-notice">For development team use only - not public facing</div>
  </header>
  
  <main class="internal-docs-content">
    <slot />
  </main>
  
  <footer class="internal-docs-footer">
    <p> {new Date().getFullYear()} Swiftie App - Internal Use Only</p>
  </footer>
</div>

<style>
  .internal-docs-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .internal-docs-header {
    padding: 1rem;
    background-color: #f0f4f8;
    border-bottom: 1px solid #e9ecef;
  }
  
  .developer-notice {
    background-color: #ffe8e8;
    color: #d32f2f;
    padding: 0.5rem;
    margin-top: 0.5rem;
    border-radius: 4px;
    font-weight: bold;
    text-align: center;
  }
  
  .internal-docs-content {
    flex: 1;
    padding: 2rem;
  }
  
  .internal-docs-footer {
    padding: 1rem;
    text-align: center;
    border-top: 1px solid #e9ecef;
    font-size: 0.875rem;
    color: #6c757d;
  }
</style>