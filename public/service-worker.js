// Service Worker for HealthTrack App

const CACHE_NAME = "healthtrack-v1"
const urlsToCache = ["/", "/dashboard", "/settings", "/manifest.json", "/favicon.ico"]

// Install event - cache assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")
      return cache.addAll(urlsToCache)
    }),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})

// Fetch event - serve from cache, then network
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response
      }

      // Clone the request
      const fetchRequest = event.request.clone()

      return fetch(fetchRequest).then((response) => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response
        }

        // Clone the response
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          // Don't cache API requests or dynamic content
          if (!event.request.url.includes("/api/")) {
            cache.put(event.request, responseToCache)
          }
        })

        return response
      })
    }),
  )
})

// Handle offline data sync
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-health-data") {
    event.waitUntil(syncHealthData())
  }
})

// Function to sync data when back online
async function syncHealthData() {
  // Get data from IndexedDB that needs to be synced
  const dataToSync = await getOfflineData()

  if (dataToSync && dataToSync.length > 0) {
    try {
      // This would be replaced with actual API calls in a real implementation
      console.log("Syncing offline data", dataToSync)

      // Clear synced data
      await clearOfflineData()

      // Notify the user
      self.registration.showNotification("HealthTrack", {
        body: "Your health data has been synced successfully!",
        icon: "/favicon.ico",
      })
    } catch (error) {
      console.error("Error syncing data:", error)
    }
  }
}

// Mock functions for offline data handling
// In a real app, these would use IndexedDB
async function getOfflineData() {
  return []
}

async function clearOfflineData() {
  return true
}

