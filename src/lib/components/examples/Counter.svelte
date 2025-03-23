<script>
  // Using Svelte 5 runes syntax
  let count = $state(0);
  
  function increment() {
    count++;
  }
  
  function decrement() {
    if (count > 0) {
      count--;
    }
  }
  
  function reset() {
    count = 0;
  }
  
  // Using $effect instead of lifecycle methods for Svelte 5 compatibility
  $effect(() => {
    // This will run whenever count changes
    console.log(`Count updated to: ${count}`);
  });
</script>

<div class="counter-container">
  <h2>Counter Example</h2>
  <p class="count">Count: {count}</p>
  
  <div class="button-group">
    <button on:click={decrement} class="btn btn-secondary">Decrement</button>
    <button on:click={reset} class="btn btn-neutral">Reset</button>
    <button on:click={increment} class="btn btn-primary">Increment</button>
  </div>
</div>

<style>
  .counter-container {
    padding: 1rem;
    border: 1px solid #ddd;
    border-radius: 0.5rem;
    max-width: 300px;
    margin: 0 auto;
    text-align: center;
  }
  
  .count {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 1rem 0;
  }
  
  .button-group {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
  }
  
  .btn {
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 0.25rem;
    cursor: pointer;
    font-weight: bold;
  }
  
  .btn-primary {
    background-color: #3b82f6;
    color: white;
  }
  
  .btn-secondary {
    background-color: #ef4444;
    color: white;
  }
  
  .btn-neutral {
    background-color: #9ca3af;
    color: white;
  }
</style>
