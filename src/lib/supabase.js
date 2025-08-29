import { createClient } from '@supabase/supabase-js'

// Credenciais diretas para resolver problema de variáveis de ambiente no Vercel
const supabaseUrl = 'https://truepksaojbpgwdtelbb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRydWVwa3Nhb2picGd3ZHRlbGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ1NzM0NjcsImV4cCI6MjA3MDE0OTQ2N30.UO0hdlI6IAvJeWDEbrnicMMLNn9ExAV7zPQlEc3DgTk'

console.log('🔧 Supabase Config:', { url: supabaseUrl, hasKey: !!supabaseAnonKey })

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Função para upload de arquivos
export const uploadFile = async (file, bucket = 'uploads', folder = '') => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = folder ? `${folder}/${fileName}` : fileName

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Obter URL pública do arquivo
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath)

    return {
      path: data.path,
      url: publicUrl,
      fullPath: data.fullPath
    }
  } catch (error) {
    console.error('Erro no upload:', error)
    throw error
  }
}

// Função para deletar arquivo
export const deleteFile = async (path, bucket = 'uploads') => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error('Erro ao deletar arquivo:', error)
    throw error
  }
}

// Função para obter URL pública
export const getPublicUrl = (path, bucket = 'uploads') => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

