
// manifest nghĩa là rõ ràng; file này giống file apple-icon.png -> Tăng trải nghiệm của người dùng 
// manifest.json hay còn gọi là PWA (Progressive Web App)

import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        "name": "NextJS - SoudCloud",
        "short_name": "NJS-SC",
        "description": "Học NextJS + React với Hỏi Dân IT",
        "icons": [
            {
                "src": "https://salt.tikicdn.com/ts/upload/2f/51/80/5643672027a54bfa593300f53c91c12a.png",
                "sizes": "192x192",
                "type": "image/png",
            },
            {
                "src": "https://salt.tikicdn.com/ts/upload/2f/51/80/5643672027a54bfa593300f53c91c12a.png",
                "sizes": "512x512",
                "type": "image/png",
            }
        ],
        "theme_color": "#1A94FF",
        "background_color": "#1A94FF",
        "start_url": "/",
        "display": "standalone",
        "orientation": "portrait",
        "related_applications": [
            {
                "platform": "play",
                "url": "https://play.google.com/store/apps/details?id=vn.tiki.app.tikiandroid",
                "id": "vn.tiki.app.tikiandroid"
            },
            {
                "platform": "itunes",
                "url": "https://apps.apple.com/vn/app/tiki-shopping-fast-shipping/id958100553"
            },
            {
                "platform": "webapp",
                "url": "https://tiki.vn/manifest.json"
            }
        ],
        "scope": "/"
    }
}