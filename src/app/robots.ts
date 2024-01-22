
// tạo file 'ts' thay vì 'txt, xml, json' để cs thể đc báo lỗi
// robots.txt, sitemap.xml, manifest.json để cấu hình cho các bot đào kiếm thông tin tốt hơn

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*', // cho phép bot nào trên thế giới có thể tìm kiếm, đào thông tin (như bot của Google, Minecrosoft,...)
            allow: '/', // cho phép bot truy cập đg link url nào
            disallow: '/private/', // k cho phép bot truy cập đg link url nào
        },
        sitemap: 'http://localhost:3000/sitemap.xml', // link tới file sitemap.xml -> các file bên sitemap.xml cho con bot biết đg link url nào đc ưu tiên và kém ưu tiên hơn
    }
}