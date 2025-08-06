import supabase from '../supabase/client.js'

// Insert a new user
export const addUser = async (user) => {
  const { data, error } = await supabase
    .from('users')
    .insert([user])

  if (error) throw error
  return data
}

// Get all users
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')

  if (error) throw error
  return data
}
