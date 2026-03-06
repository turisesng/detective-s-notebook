import { supabase } from '@/lib/supabase';

/**
 * Upload an image file to Supabase Storage
 * Organizes files by type (victims, suspects, scenes, evidence) and case
 */
export async function uploadImage(
  file: File,
  type: 'victims' | 'suspects' | 'scenes' | 'evidence',
  caseId: string
): Promise<string> {
  if (!file) throw new Error('No file provided');
  
  // Validate file is an image
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Create unique filename to avoid collisions
  const timestamp = Date.now();
  const randomId = Math.random().toString(36).slice(2, 10);
  const ext = file.name.split('.').pop() || 'jpg';
  const filename = `${timestamp}-${randomId}.${ext}`;
  
  // Path: detective-app/{type}/{caseId}/{filename}
  const filePath = `detective-app/${type}/${caseId}/${filename}`;

  try {
    const { data, error } = await supabase.storage
      .from('detective-app')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Failed to upload image: ${error.message}`);
    }

    // Return public URL
    const { data: publicUrlData } = supabase.storage
      .from('detective-app')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Image upload failed:', err);
    throw err;
  }
}

/**
 * Delete an image from Supabase Storage
 */
export async function deleteImage(imageUrl: string): Promise<void> {
  try {
    // Extract file path from URL
    const url = new URL(imageUrl);
    const filePath = url.pathname.split('/storage/v1/object/public/detective-app/')[1];
    
    if (!filePath) {
      throw new Error('Invalid image URL');
    }

    const { error } = await supabase.storage
      .from('detective-app')
      .remove([`detective-app/${filePath}`]);

    if (error) {
      console.error('Delete error:', error);
      throw new Error(`Failed to delete image: ${error.message}`);
    }
  } catch (err) {
    console.error('Image deletion failed:', err);
    throw err;
  }
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image (JPEG, PNG, GIF, etc.)' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'Image must be smaller than 5MB' };
  }

  return { valid: true };
}
