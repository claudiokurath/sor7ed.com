// Helper to call local APIs
async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(endpoint, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `API Error: ${response.statusText}`);
    }

    return response.json();
}

/**
 * Save user signup to CRM via serverless function
 */
export async function saveSignup(data: {
    name: string
    email: string
    phone?: string
    template: string
}) {
    try {
        return await apiFetch('/api/signup', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('Error in saveSignup:', error);
        throw error;
    }
}

// These are currently unused in the UI but kept for future dynamic content
// They would require corresponding serverless functions at /api/blog and /api/tools
export async function getBlogPosts() {
    console.warn('getBlogPosts now requires a serverless endpoint. Currently returns static fallback.');
    return [];
}

export async function getTools() {
    console.warn('getTools now requires a serverless endpoint. Currently returns static fallback.');
    return [];
}

