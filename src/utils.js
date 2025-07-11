export function isAndroid() {
  return typeof navigator !== 'undefined' && /android/i.test(navigator.userAgent)
}

export function isSmallIOS() {
  return typeof navigator !== 'undefined' && /iPhone|iPod/.test(navigator.userAgent)
}

export function isLargeIOS() {
  return (
    typeof navigator !== 'undefined' &&
    (/iPad/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))
  )
}

export function isIOS() {
  return isSmallIOS() || isLargeIOS()
}

export function isMobile() {
  return isAndroid() || isIOS()
}

// export function addrShort(address) {
//   return `0x${address.slice(2, 6).toUpperCase()}...${address.slice(-4).toUpperCase()}`
// }

// Avatar fallback utilities
export function createAvatarFallback(smileyFaceSvg) {
  return {
    // Handle image error events
    handleImageError(event) {
      event.target.src = smileyFaceSvg
      event.target.onerror = null // Prevent infinite loop
    },

    // Handle image loading with timeout
    handleImageLoadWithTimeout(img, avatarUrl, timeoutMs = 5000) {
      return new Promise((resolve, reject) => {
        let isResolved = false

        const timeout = setTimeout(() => {
          if (!isResolved) {
            isResolved = true
            img.src = smileyFaceSvg
            img.onerror = null
            resolve(false) // Timeout occurred
          }
        }, timeoutMs)

        const originalOnLoad = img.onload
        const originalOnError = img.onerror

        img.onload = () => {
          if (!isResolved) {
            isResolved = true
            clearTimeout(timeout)
            if (originalOnLoad) originalOnLoad.call(img)
            resolve(true) // Success
          }
        }

        img.onerror = () => {
          if (!isResolved) {
            isResolved = true
            clearTimeout(timeout)
            img.src = smileyFaceSvg
            img.onerror = null
            resolve(false) // Error occurred
          }
        }

        // If avatarUrl is already the fallback, don't apply timeout
        if (avatarUrl && avatarUrl !== smileyFaceSvg) {
          img.src = avatarUrl
        }
      })
    },

    // Get avatar URL with fallback
    getAvatarUrl(avatarUrl) {
      return avatarUrl || smileyFaceSvg
    },

    // Create background-image style with fallback
    getAvatarBackgroundStyle(avatarUrl) {
      return {
        backgroundImage: `url(${avatarUrl || smileyFaceSvg})`
      }
    },

    // Test if avatar URL is valid (returns promise)
    async testAvatarUrl(avatarUrl) {
      if (!avatarUrl) return false

      return new Promise((resolve) => {
        const img = new Image()
        let isResolved = false

        const timeout = setTimeout(() => {
          if (!isResolved) {
            isResolved = true
            resolve(false)
          }
        }, 5000) // 5 second timeout

        img.onload = () => {
          if (!isResolved) {
            isResolved = true
            clearTimeout(timeout)
            resolve(true)
          }
        }

        img.onerror = () => {
          if (!isResolved) {
            isResolved = true
            clearTimeout(timeout)
            resolve(false)
          }
        }

        img.src = avatarUrl
      })
    },

    // Preload image with timeout (useful for eager loading)
    async preloadAvatarWithTimeout(avatarUrl, timeoutMs = 5000) {
      if (!avatarUrl || avatarUrl === smileyFaceSvg) return false

      return new Promise((resolve) => {
        const img = new Image()
        let isResolved = false

        const timeout = setTimeout(() => {
          if (!isResolved) {
            isResolved = true
            resolve(false)
          }
        }, timeoutMs)

        img.onload = () => {
          if (!isResolved) {
            isResolved = true
            clearTimeout(timeout)
            resolve(true)
          }
        }

        img.onerror = () => {
          if (!isResolved) {
            isResolved = true
            clearTimeout(timeout)
            resolve(false)
          }
        }

        img.src = avatarUrl
      })
    }
  }
}
