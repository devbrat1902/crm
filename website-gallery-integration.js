/**
 * JustForKidz Gallery Integration
 * 
 * Add this to your public website to display the gallery.
 * 1. Add Supabase JS CDN: <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
 * 2. Add a container: <div id="jfk-gallery"></div>
 * 3. Include this script.
 */

const JfkGallery = {
  supabaseUrl: 'https://dnhkdloztlrhsxisbwbs.supabase.co',
  supabaseKey: 'sb_publishable_25MLRb11MWbpVs87KChnYA_rMXc_BI0',

  async init() {
    const supabase = window.supabase.createClient(this.supabaseUrl, this.supabaseKey);
    const container = document.getElementById('jfk-gallery');

    if (!container) return;

    container.innerHTML = `<div style="text-align:center; padding: 40px;">Loading Gallery...</div>`;

    try {
      const { data: images, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      this.render(container, images);
    } catch (error) {
      console.error('Error loading gallery:', error);
      container.innerHTML = `<div style="color: red; text-align:center;">Failed to load gallery.</div>`;
    }
  },

  render(container, images) {
    if (!images || images.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding: 40px; color: #666;">No images to display yet.</div>`;
      return;
    }

    const gridHtml = images.map(img => `
            <div class="gallery-card">
                <div class="gallery-image-wrapper">
                    <img src="${img.url}" alt="${img.title}" loading="lazy">
                </div>
                <div class="gallery-info">
                    <h3>${img.title}</h3>
                    <p>${img.description || ''}</p>
                </div>
            </div>
        `).join('');

    container.innerHTML = `
            <style>
                #jfk-gallery {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 24px;
                    padding: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .gallery-card {
                    background: white;
                    border-radius: 20px;
                    overflow: hidden;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                .gallery-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 15px 40px rgba(0,0,0,0.1);
                }
                .gallery-image-wrapper {
                    aspect-ratio: 16/10;
                    overflow: hidden;
                }
                .gallery-image-wrapper img {
                    width: 100%;
                    height: 100%;
                    object-cover: cover;
                    transition: transform 0.5s ease;
                }
                .gallery-card:hover img {
                    transform: scale(1.05);
                }
                .gallery-info {
                    padding: 20px;
                }
                .gallery-info h3 {
                    margin: 0;
                    font-size: 1.1rem;
                    color: #333;
                    font-family: inherit;
                }
                .gallery-info p {
                    margin: 8px 0 0;
                    font-size: 0.9rem;
                    color: #666;
                    line-height: 1.5;
                }
            </style>
            ${gridHtml}
        `;
  }
};

// Auto-init when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => JfkGallery.init());
} else {
  JfkGallery.init();
}
