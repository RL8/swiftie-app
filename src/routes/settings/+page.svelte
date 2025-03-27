<script lang="ts">
    import { fade, fly } from 'svelte/transition';
    import Header from '$lib/components/layout/Header.svelte';
    import MainAppLayout from '$lib/components/layout/MainAppLayout.svelte';
    import { getSafeAppContext } from '$lib/utils/context-helpers';
    
    // Use safe context helper
    const app = getSafeAppContext();
    
    // Settings sections
    const sections = $state([
        {
            id: 'about',
            title: 'About Us',
            icon: '📝',
            expanded: true
        },
        {
            id: 'preferences',
            title: 'App Preferences',
            icon: '⚙️',
            expanded: false
        },
        {
            id: 'premium',
            title: 'Premium Features',
            icon: '✨',
            expanded: false
        },
        {
            id: 'help',
            title: 'Help & Support',
            icon: '❓',
            expanded: false
        }
    ]);
    
    function toggleSection(id: string) {
        sections = sections.map(section => ({
            ...section,
            expanded: section.id === id ? !section.expanded : section.expanded
        }));
    }
    
    // Theme options
    const themes = [
        { id: 'light', name: 'Light Mode', icon: '☀️' },
        { id: 'dark', name: 'Dark Mode', icon: '🌙' },
        { id: 'auto', name: 'System Default', icon: '🔄' }
    ];
    
    let selectedTheme = $state('light');
    
    function setTheme(themeId: string) {
        selectedTheme = themeId;
        // In a real app, this would update the theme in localStorage and apply it
    }
</script>

<MainAppLayout>
    <svelte:fragment slot="header">
        <Header title="Settings" />
    </svelte:fragment>
    
    <div class="settings-page">
        <div class="settings-container">
            <!-- About Us Section -->
            <div class="settings-section">
                <button 
                    class="section-header" 
                    on:click={() => toggleSection('about')}
                    aria-expanded={sections.find(s => s.id === 'about')?.expanded}
                >
                    <span class="section-icon">📝</span>
                    <h2>About Us</h2>
                    <span class="toggle-icon">{sections.find(s => s.id === 'about')?.expanded ? '▼' : '►'}</span>
                </button>
                
                {#if sections.find(s => s.id === 'about')?.expanded}
                    <div class="section-content" in:fade={{duration: 300}}>
                        <div class="about-content">
                            <h3>Welcome to the Swiftie App!</h3>
                            <p>
                                This app is designed for Taylor Swift fans to explore her music, 
                                create personalized song lists, and connect with other Swifties.
                            </p>
                            
                            <h4>Our Mission</h4>
                            <p>
                                To create the ultimate platform for Taylor Swift fans to celebrate 
                                her music and connect with each other through shared experiences.
                            </p>
                            
                            <h4>App Version</h4>
                            <p>Version 1.0.0</p>
                            
                            <div class="team-section">
                                <h4>Our Team</h4>
                                <div class="team-members">
                                    <div class="team-member">
                                        <div class="member-avatar">👩‍💻</div>
                                        <div class="member-info">
                                            <h5>Sarah Johnson</h5>
                                            <p>Lead Developer</p>
                                        </div>
                                    </div>
                                    <div class="team-member">
                                        <div class="member-avatar">🎨</div>
                                        <div class="member-info">
                                            <h5>Michael Chen</h5>
                                            <p>UI/UX Designer</p>
                                        </div>
                                    </div>
                                    <div class="team-member">
                                        <div class="member-avatar">📊</div>
                                        <div class="member-info">
                                            <h5>Emma Williams</h5>
                                            <p>Data Analyst</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
            
            <!-- App Preferences Section -->
            <div class="settings-section">
                <button 
                    class="section-header" 
                    on:click={() => toggleSection('preferences')}
                    aria-expanded={sections.find(s => s.id === 'preferences')?.expanded}
                >
                    <span class="section-icon">⚙️</span>
                    <h2>App Preferences</h2>
                    <span class="toggle-icon">{sections.find(s => s.id === 'preferences')?.expanded ? '▼' : '►'}</span>
                </button>
                
                {#if sections.find(s => s.id === 'preferences')?.expanded}
                    <div class="section-content" in:fade={{duration: 300}}>
                        <div class="preference-group">
                            <h3>Theme</h3>
                            <div class="theme-options">
                                {#each themes as theme}
                                    <button 
                                        class="theme-option {selectedTheme === theme.id ? 'selected' : ''}"
                                        on:click={() => setTheme(theme.id)}
                                    >
                                        <span class="theme-icon">{theme.icon}</span>
                                        <span>{theme.name}</span>
                                    </button>
                                {/each}
                            </div>
                        </div>
                        
                        <div class="preference-group">
                            <h3>Notifications</h3>
                            <div class="toggle-option">
                                <span>Enable Push Notifications</span>
                                <label class="switch">
                                    <input type="checkbox" checked>
                                    <span class="slider round"></span>
                                </label>
                            </div>
                            
                            <div class="toggle-option">
                                <span>Email Updates</span>
                                <label class="switch">
                                    <input type="checkbox">
                                    <span class="slider round"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
            
            <!-- Premium Features Section -->
            <div class="settings-section">
                <button 
                    class="section-header" 
                    on:click={() => toggleSection('premium')}
                    aria-expanded={sections.find(s => s.id === 'premium')?.expanded}
                >
                    <span class="section-icon">✨</span>
                    <h2>Premium Features</h2>
                    <span class="toggle-icon">{sections.find(s => s.id === 'premium')?.expanded ? '▼' : '►'}</span>
                </button>
                
                {#if sections.find(s => s.id === 'premium')?.expanded}
                    <div class="section-content" in:fade={{duration: 300}}>
                        <div class="premium-content">
                            <div class="premium-banner">
                                <h3>Upgrade to Premium</h3>
                                <p>Get access to exclusive features and content!</p>
                                <button class="premium-button">Learn More</button>
                            </div>
                            
                            <h4>Premium Benefits</h4>
                            <ul class="benefits-list">
                                <li>
                                    <span class="benefit-icon">🎵</span>
                                    <span>Exclusive playlists and mixes</span>
                                </li>
                                <li>
                                    <span class="benefit-icon">🎨</span>
                                    <span>Custom themes and visualizations</span>
                                </li>
                                <li>
                                    <span class="benefit-icon">📊</span>
                                    <span>Advanced statistics and insights</span>
                                </li>
                                <li>
                                    <span class="benefit-icon">🏆</span>
                                    <span>Early access to new features</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                {/if}
            </div>
            
            <!-- Help & Support Section -->
            <div class="settings-section">
                <button 
                    class="section-header" 
                    on:click={() => toggleSection('help')}
                    aria-expanded={sections.find(s => s.id === 'help')?.expanded}
                >
                    <span class="section-icon">❓</span>
                    <h2>Help & Support</h2>
                    <span class="toggle-icon">{sections.find(s => s.id === 'help')?.expanded ? '▼' : '►'}</span>
                </button>
                
                {#if sections.find(s => s.id === 'help')?.expanded}
                    <div class="section-content" in:fade={{duration: 300}}>
                        <div class="help-content">
                            <h3>Frequently Asked Questions</h3>
                            
                            <div class="faq-item">
                                <h4>How do I reset my album selections?</h4>
                                <p>
                                    You can reset your album selections by going to the Profile page 
                                    and clicking on "Reset Selections" in the Albums section.
                                </p>
                            </div>
                            
                            <div class="faq-item">
                                <h4>Can I change my username?</h4>
                                <p>
                                    Yes! You can update your username anytime from the Profile page.
                                </p>
                            </div>
                            
                            <div class="faq-item">
                                <h4>How do I create a custom list?</h4>
                                <p>
                                    Navigate to the Swiftivities page and select "List Keeper" to 
                                    create and manage your custom lists.
                                </p>
                            </div>
                            
                            <h3>Contact Us</h3>
                            <p>
                                Have a question or feedback? Reach out to us at 
                                <a href="mailto:support@swiftieapp.com">support@swiftieapp.com</a>
                            </p>
                        </div>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</MainAppLayout>

<style>
    .settings-page {
        padding: 1rem;
        max-width: 800px;
        margin: 0 auto;
    }
    
    .settings-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    
    .settings-section {
        background-color: white;
        border-radius: 0.5rem;
        overflow: hidden;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .section-header {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 1rem;
        background-color: white;
        border: none;
        text-align: left;
        cursor: pointer;
    }
    
    .section-header:hover {
        background-color: #f9f9f9;
    }
    
    .section-icon {
        margin-right: 0.75rem;
        font-size: 1.25rem;
    }
    
    .section-header h2 {
        flex: 1;
        margin: 0;
        font-size: 1.25rem;
    }
    
    .toggle-icon {
        font-size: 0.75rem;
    }
    
    .section-content {
        padding: 1rem;
        border-top: 1px solid #eee;
    }
    
    /* About Us Styles */
    .about-content h3 {
        margin-top: 0;
        color: var(--color-primary);
    }
    
    .about-content h4 {
        margin-top: 1.5rem;
        margin-bottom: 0.5rem;
        color: var(--color-primary-dark);
    }
    
    .team-section {
        margin-top: 1.5rem;
    }
    
    .team-members {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        margin-top: 0.5rem;
    }
    
    .team-member {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        background-color: #f9f9f9;
        padding: 0.75rem;
        border-radius: 0.5rem;
        width: calc(50% - 0.5rem);
    }
    
    @media (max-width: 640px) {
        .team-member {
            width: 100%;
        }
    }
    
    .member-avatar {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        background-color: var(--color-primary-light);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
    }
    
    .member-info h5 {
        margin: 0;
        font-size: 1rem;
    }
    
    .member-info p {
        margin: 0;
        font-size: 0.875rem;
        color: #666;
    }
    
    /* Preferences Styles */
    .preference-group {
        margin-bottom: 1.5rem;
    }
    
    .preference-group h3 {
        margin-top: 0;
        margin-bottom: 0.75rem;
        color: var(--color-primary-dark);
    }
    
    .theme-options {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
    }
    
    .theme-option {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.75rem;
        background-color: #f5f5f5;
        border: 2px solid transparent;
        border-radius: 0.5rem;
        cursor: pointer;
    }
    
    .theme-option.selected {
        border-color: var(--color-primary);
        background-color: var(--color-primary-light);
    }
    
    .theme-icon {
        font-size: 1.25rem;
    }
    
    .toggle-option {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
    }
    
    /* Switch Toggle */
    .switch {
        position: relative;
        display: inline-block;
        width: 3rem;
        height: 1.5rem;
    }
    
    .switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }
    
    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: .4s;
    }
    
    .slider:before {
        position: absolute;
        content: "";
        height: 1.1rem;
        width: 1.1rem;
        left: 0.2rem;
        bottom: 0.2rem;
        background-color: white;
        transition: .4s;
    }
    
    input:checked + .slider {
        background-color: var(--color-primary);
    }
    
    input:checked + .slider:before {
        transform: translateX(1.5rem);
    }
    
    .slider.round {
        border-radius: 1.5rem;
    }
    
    .slider.round:before {
        border-radius: 50%;
    }
    
    /* Premium Styles */
    .premium-banner {
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        text-align: center;
        margin-bottom: 1.5rem;
    }
    
    .premium-banner h3 {
        margin-top: 0;
        margin-bottom: 0.5rem;
    }
    
    .premium-banner p {
        margin-bottom: 1rem;
    }
    
    .premium-button {
        background-color: white;
        color: var(--color-primary-dark);
        border: none;
        padding: 0.5rem 1.25rem;
        border-radius: 1.5rem;
        font-weight: bold;
        cursor: pointer;
    }
    
    .benefits-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .benefits-list li {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 0;
        border-bottom: 1px solid #eee;
    }
    
    .benefits-list li:last-child {
        border-bottom: none;
    }
    
    .benefit-icon {
        font-size: 1.25rem;
    }
    
    /* Help & Support Styles */
    .faq-item {
        margin-bottom: 1.25rem;
    }
    
    .faq-item h4 {
        margin-top: 0;
        margin-bottom: 0.5rem;
        color: var(--color-primary-dark);
    }
    
    .faq-item p {
        margin: 0;
    }
    
    .help-content a {
        color: var(--color-primary);
        text-decoration: none;
    }
    
    .help-content a:hover {
        text-decoration: underline;
    }
</style>
