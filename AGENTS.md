# Project guidance

## Optimize media before adding it

- Optimize raster images before committing them, especially files under `public/blog/`. Prefer WebP or AVIF for web delivery and aim for visually indistinguishable quality at the size the page displays the image.
- Preserve image dimensions when converting an existing image unless the page displays it at a smaller fixed size. For new images, avoid shipping pixels substantially beyond their largest display size.
- Update every page, content, metadata, and social-preview reference when changing an image format. Remove the old public copy when no longer referenced and no source-file use requires it.
- Lazy-load below-the-fold images and use asynchronous decoding. Keep above-the-fold hero and likely LCP images eager.
- Set nonessential video elements to `preload="none"` so visitors do not download video data before choosing playback.
- Keep media optimization behind the scenes: preserve the existing page layout, content, and intended visual appearance.
- Keep the workflow cross-platform. Prefer the project's existing dependencies or build pipeline; do not require macOS-only tools or add new local setup steps that Windows contributors cannot use.
