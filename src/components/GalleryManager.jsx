import React, { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function GalleryManager() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentImage, setCurrentImage] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageFiles: []
  })

  useEffect(() => {
    fetchImages()
  }, [])

  async function fetchImages() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setImages(data || [])
    } catch (error) {
      console.error('Error fetching images:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleUpload(e) {
    e.preventDefault()
    if (!currentImage && formData.imageFiles.length === 0) {
      alert('Please select at least one image')
      return
    }

    try {
      setUploading(true)

      const files = formData.imageFiles.length > 0 ? formData.imageFiles : []

      // If editing a single image
      if (currentImage) {
        let imageUrl = currentImage.url
        if (files[0]) {
          const file = files[0]
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const filePath = `gallery/${fileName}`
          const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file)
          if (uploadError) throw uploadError
          const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath)
          imageUrl = publicUrl
        }

        const { error } = await supabase
          .from('gallery_images')
          .update({
            title: formData.title,
            description: formData.description,
            url: imageUrl
          })
          .eq('id', currentImage.id)

        if (error) throw error
      } else {
        // Bulk Upload for new images
        const uploadPromises = Array.from(files).map(async (file) => {
          const fileExt = file.name.split('.').pop()
          const fileName = `${Math.random()}.${fileExt}`
          const filePath = `gallery/${fileName}`

          const { error: uploadError } = await supabase.storage.from('images').upload(filePath, file)
          if (uploadError) throw uploadError

          const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath)

          return {
            title: formData.title || file.name.split('.')[0],
            description: formData.description,
            url: publicUrl
          }
        })

        const imagesToInsert = await Promise.all(uploadPromises)
        const { error } = await supabase.from('gallery_images').insert(imagesToInsert)
        if (error) throw error
      }

      setIsModalOpen(false)
      fetchImages()
      resetForm()
    } catch (error) {
      console.error('Error uploading:', error)
      alert(error.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id, url) {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      // Extract path from URL
      const path = url.split('/storage/v1/object/public/images/')[1]

      if (path) {
        await supabase.storage.from('images').remove([path])
      }

      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchImages()
    } catch (error) {
      console.error('Error deleting:', error)
      alert('Error deleting image')
    }
  }

  function resetForm() {
    setFormData({ title: '', description: '', imageFiles: [] })
    setCurrentImage(null)
  }

  function openModal(image = null) {
    if (image) {
      setCurrentImage(image)
      setFormData({
        title: image.title,
        description: image.description,
        imageFiles: []
      })
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-xl font-bold">Gallery Management</h1>
          <p className="text-muted">Upload and manage images for the public website.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn btn-primary"
        >
          <Plus size={20} />
          Add New Image
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin" style={{ color: 'var(--primary)' }} size={40} />
        </div>
      ) : images.length === 0 ? (
        <div className="card p-20 text-center" style={{ borderStyle: 'dashed' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'var(--primary)', opacity: 0.1 }}>
            <ImageIcon style={{ color: 'var(--primary)' }} size={32} />
          </div>
          <h3 className="font-semibold">No images yet</h3>
          <p className="text-muted mb-6">Upload your first image to showcase on the website.</p>
          <button
            onClick={() => openModal()}
            className="btn btn-primary"
          >
            <Plus size={20} />
            Upload Now
          </button>
        </div>
      ) : (
        <div className="gallery-grid">
          {images.map((image) => (
            <div key={image.id} className="gallery-card">
              <div className="image-container">
                <img src={image.url} alt={image.title} />
                <div className="image-overlay">
                  <button
                    onClick={() => openModal(image)}
                    className="btn btn-primary p-2"
                    style={{ borderRadius: '50%', width: '40px', height: '40px' }}
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(image.id, image.url)}
                    className="btn p-2"
                    style={{ borderRadius: '50%', width: '40px', height: '40px', backgroundColor: 'var(--danger)', color: 'white' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h4 className="font-semibold" style={{ margin: 0 }}>{image.title}</h4>
                <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '0.875rem' }}>{image.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload/Edit Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="p-6 border-b flex justify-between items-center" style={{ borderBottom: '1px solid var(--border)' }}>
              <h3 className="font-bold">
                {currentImage ? 'Edit Image' : 'Upload New Image'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn-ghost p-1 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-6">
              <div style={{ marginBottom: '1.5rem' }}>
                <label className="font-semibold" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Title</label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="e.g. Summer Camp 2024"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="font-semibold" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Description</label>
                <textarea
                  className="input"
                  style={{ minHeight: '100px' }}
                  placeholder="Describe this image..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label className="font-semibold" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  Select Image(s) {currentImage && '(Leave empty to keep current)'}
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    multiple={!currentImage}
                    required={!currentImage}
                    className="input"
                    onChange={(e) => setFormData({ ...formData, imageFiles: Array.from(e.target.files) })}
                  />
                  {!currentImage && (
                    <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                      You can select multiple images at once.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-ghost"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    currentImage ? 'Save Changes' : 'Upload Image'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
