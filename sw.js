// BudgetWise Service Worker
// Provides offline functionality and caching

const CACHE_NAME = 'budgetwise-v1';
const STATIC_CACHE = 'budgetwise-static-v1';
const DYNAMIC_CACHE = 'budgetwise-dynamic-v1';

// Assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',
    'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js',
    'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('[ServiceWorker] Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[ServiceWorker] Static assets cached');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('[ServiceWorker] Failed to cache static assets:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName !== STATIC_CACHE && 
                                   cacheName !== DYNAMIC_CACHE;
                        })
                        .map((cacheName) => {
                            console.log('[ServiceWorker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[ServiceWorker] Claiming clients');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http(s) requests
    if (!url.protocol.startsWith('http')) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Return cached response if available
                if (cachedResponse) {
                    console.log('[ServiceWorker] Serving from cache:', request.url);
                    
                    // Fetch updated version in background (stale-while-revalidate)
                    fetch(request)
                        .then((networkResponse) => {
                            if (networkResponse && networkResponse.status === 200) {
                                caches.open(DYNAMIC_CACHE)
                                    .then((cache) => {
                                        cache.put(request, networkResponse.clone());
                                    });
                            }
                        })
                        .catch(() => {
                            // Network failed, that's fine - we have cached version
                        });
                    
                    return cachedResponse;
                }

                // No cache, try network
                return fetch(request)
                    .then((networkResponse) => {
                        // Check if valid response
                        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                            return networkResponse;
                        }

                        // Clone response for cache
                        const responseToCache = networkResponse.clone();

                        // Add to dynamic cache
                        caches.open(DYNAMIC_CACHE)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });

                        return networkResponse;
                    })
                    .catch((error) => {
                        console.error('[ServiceWorker] Fetch failed:', error);
                        
                        // Return offline page for navigation requests
                        if (request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        
                        // Return empty response for other requests
                        return new Response('', { status: 408, statusText: 'Offline' });
                    });
            })
    );
});

// Background sync for offline transactions
self.addEventListener('sync', (event) => {
    console.log('[ServiceWorker] Sync event:', event.tag);
    
    if (event.tag === 'sync-transactions') {
        event.waitUntil(syncTransactions());
    }
});

async function syncTransactions() {
    try {
        // Get pending transactions from IndexedDB
        const pendingTransactions = await getPendingTransactions();
        
        // Sync each transaction
        for (const transaction of pendingTransactions) {
            try {
                // In a real app, this would send to server
                // await fetch('/api/transactions', {
                //     method: 'POST',
                //     body: JSON.stringify(transaction)
                // });
                
                // For now, just mark as synced
                await markTransactionSynced(transaction.id);
            } catch (error) {
                console.error('[ServiceWorker] Failed to sync transaction:', error);
            }
        }
        
        console.log('[ServiceWorker] Transactions synced');
    } catch (error) {
        console.error('[ServiceWorker] Sync failed:', error);
    }
}

// Push notification handling
self.addEventListener('push', (event) => {
    console.log('[ServiceWorker] Push received');
    
    let data = {
        title: 'BudgetWise',
        body: 'You have a new notification',
        icon: '/icons/icon-192.png',
        badge: '/icons/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            { action: 'explore', title: 'View' },
            { action: 'close', title: 'Close' }
        ]
    };
    
    if (event.data) {
        try {
            data = { ...data, ...event.data.json() };
        } catch (e) {
            data.body = event.data.text();
        }
    }
    
    event.waitUntil(
        self.registration.showNotification(data.title, {
            body: data.body,
            icon: data.icon,
            badge: data.badge,
            vibrate: data.vibrate,
            data: data.data,
            actions: data.actions,
            tag: 'budgetwise-notification',
            renotify: true
        })
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    console.log('[ServiceWorker] Notification click:', event.action);
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true })
                .then((clientList) => {
                    // Focus existing window if available
                    for (const client of clientList) {
                        if (client.url.includes('/') && 'focus' in client) {
                            return client.focus();
                        }
                    }
                    // Open new window if no existing window
                    if (clients.openWindow) {
                        return clients.openWindow('/');
                    }
                })
        );
    }
});

// Message handling from main thread
self.addEventListener('message', (event) => {
    console.log('[ServiceWorker] Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                    return cache.addAll(event.data.urls);
                })
        );
    }
});

// Helper functions for IndexedDB operations
async function getPendingTransactions() {
    // In a real app, this would read from IndexedDB
    // For now, return empty array
    return [];
}

async function markTransactionSynced(id) {
    // In a real app, this would update IndexedDB
    console.log('[ServiceWorker] Transaction synced:', id);
}

// Periodic background sync (if supported)
self.addEventListener('periodicsync', (event) => {
    console.log('[ServiceWorker] Periodic sync:', event.tag);
    
    if (event.tag === 'update-budgets') {
        event.waitUntil(updateBudgetsInBackground());
    }
});

async function updateBudgetsInBackground() {
    try {
        // In a real app, this would fetch latest data from server
        // await fetch('/api/budgets/sync');
        console.log('[ServiceWorker] Budgets updated in background');
    } catch (error) {
        console.error('[ServiceWorker] Background sync failed:', error);
    }
}

// Cache size management
async function trimCache(cacheName, maxItems) {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > maxItems) {
        const itemsToDelete = keys.length - maxItems;
        console.log(`[ServiceWorker] Deleting ${itemsToDelete} items from ${cacheName}`);
        
        for (let i = 0; i < itemsToDelete; i++) {
            await cache.delete(keys[i]);
        }
    }
}

// Periodic cache cleanup
setInterval(() => {
    trimCache(DYNAMIC_CACHE, 50);
}, 60 * 60 * 1000); // Every hour

console.log('[ServiceWorker] Loaded');