<div class="docs-layout">
  <header class="docs-header">
    <h1>Documentation</h1>
  </header>
  
  <main class="docs-content">
    <slot />
  </main>
  
  <footer class="docs-footer">
    <p> {new Date().getFullYear()} Swiftie App</p>
  </footer>
</div>

<style>
  .docs-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .docs-header {
    padding: 1rem;
    background-color: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
  }
  
  .docs-content {
    flex: 1;
    padding: 2rem;
  }
  
  .docs-footer {
    padding: 1rem;
    text-align: center;
    border-top: 1px solid #e9ecef;
    font-size: 0.875rem;
    color: #6c757d;
  }
</style>