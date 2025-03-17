/**
 * Documentation System Integration
 * This file provides utilities to integrate with the standalone documentation system.
 */

// Configure the path to your documentation system
const DOCS_BASE_URL = '/swiftie-docs-simple'; // Adjust this based on your deployment setup

/**
 * Get a URL to the documentation system
 * @param {string} planId - Optional ID of a specific plan to link to
 * @param {string} category - Optional category to show (pending, in-progress, completed, voided)
 * @returns {string} The URL to the documentation system
 */
export function getDocsUrl(planId, category) {
    let url = `${DOCS_BASE_URL}/index.html`;
    const params = [];
    
    if (planId) {
        params.push(`plan=${encodeURIComponent(planId)}`);
    }
    
    if (category) {
        params.push(`category=${encodeURIComponent(category)}`);
    }
    
    if (params.length > 0) {
        url += `?${params.join('&')}`;
    }
    
    return url;
}

/**
 * Get a URL to the version control documentation
 * @param {string} versionId - Optional ID of a specific version to link to
 * @returns {string} The URL to the version control documentation
 */
export function getVersionControlUrl(versionId) {
    let url = `${DOCS_BASE_URL}/version-control.html`;
    
    if (versionId) {
        url += `#${encodeURIComponent(versionId)}`;
    }
    
    return url;
}

/**
 * Open the documentation system in a new tab
 * @param {string} planId - Optional ID of a specific plan to open
 * @param {string} category - Optional category to show
 */
export function openDocs(planId, category) {
    const url = getDocsUrl(planId, category);
    window.open(url, '_blank');
}

/**
 * Open the version control documentation in a new tab
 * @param {string} versionId - Optional ID of a specific version to view
 */
export function openVersionControl(versionId) {
    const url = getVersionControlUrl(versionId);
    window.open(url, '_blank');
}

/**
 * Get a list of plan IDs that can be referenced
 * This is a simple example - in a real implementation, you might fetch this from an API
 * @returns {Array<Object>} Array of plan objects with id and title
 */
export function getAvailablePlans() {
    return [
        { id: 'version-control-implementation', title: 'Version Control Implementation' },
        { id: 'user-profile-improvements', title: 'User Profile Improvements' },
        { id: 'analytics-dashboard', title: 'Analytics Dashboard Implementation' }
    ];
}

/**
 * Get available versions of the application
 * In a real implementation, this would fetch from the docs app API
 * @returns {Array<Object>} Array of version objects
 */
export function getAvailableVersions() {
    return [
        { id: 'v1.0', name: 'Version 1.0', releaseDate: '2025-03-01' },
        { id: 'v1.1', name: 'Version 1.1', releaseDate: '2025-03-15' }
    ];
}

/**
 * Get the current version of the application
 * @returns {Object} Current version object
 */
export function getCurrentVersion() {
    const versions = getAvailableVersions();
    return versions[versions.length - 1];
}

/**
 * Create a DOM element for a documentation link
 * @param {string} planId - ID of the plan to link to
 * @param {string} text - Text to display for the link
 * @returns {HTMLElement} An anchor element linking to the plan
 */
export function createDocsLink(planId, text) {
    const link = document.createElement('a');
    link.href = getDocsUrl(planId);
    link.target = '_blank';
    link.textContent = text || 'View Implementation Plan';
    link.className = 'docs-link';
    return link;
}

/**
 * Create a DOM element for a version control link
 * @param {string} versionId - ID of the version to link to
 * @param {string} text - Text to display for the link
 * @returns {HTMLElement} An anchor element linking to the version documentation
 */
export function createVersionLink(versionId, text) {
    const link = document.createElement('a');
    link.href = getVersionControlUrl(versionId);
    link.target = '_blank';
    link.textContent = text || 'View Version Details';
    link.className = 'version-link';
    return link;
}

/**
 * Create a version badge element
 * @param {string} versionId - ID of the version
 * @returns {HTMLElement} A span element with the version
 */
export function createVersionBadge(versionId) {
    const badge = document.createElement('span');
    badge.textContent = versionId || getCurrentVersion().id;
    badge.className = 'version-badge';
    badge.title = 'Click to view version details';
    badge.style.cursor = 'pointer';
    
    badge.addEventListener('click', () => {
        openVersionControl(versionId);
    });
    
    return badge;
}

/**
 * Create a version selector component
 * @param {Function} onVersionChange - Callback function when version changes
 * @returns {HTMLElement} A select element with version options
 */
export function createVersionSelector(onVersionChange) {
    const versions = getAvailableVersions();
    const select = document.createElement('select');
    select.className = 'version-selector';
    
    versions.forEach(version => {
        const option = document.createElement('option');
        option.value = version.id;
        option.textContent = `${version.name} (${version.releaseDate})`;
        select.appendChild(option);
    });
    
    // Set to latest version by default
    select.value = versions[versions.length - 1].id;
    
    if (onVersionChange && typeof onVersionChange === 'function') {
        select.addEventListener('change', () => {
            onVersionChange(select.value);
        });
    }
    
    return select;
}

/**
 * Track an implementation plan in the version control system
 * This is a placeholder function - in a real implementation, you would send this data to the docs system
 * @param {string} versionId - ID of the version being worked on
 * @param {string} planId - ID of the implementation plan
 * @param {string} status - Status of the implementation (started, in-progress, completed)
 */
export function trackImplementation(versionId, planId, status) {
    console.log(`Tracking implementation: Version ${versionId}, Plan ${planId}, Status: ${status}`);
    // In a real implementation, you would send this data to the docs system
    // For example via a fetch API call to your docs system
    return { success: true, message: 'Implementation tracked' };
}
