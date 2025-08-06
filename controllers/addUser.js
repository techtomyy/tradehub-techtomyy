import { addUser, getAllUsers } from './services/userService.js'

const run = async () => {
  try {
    const newUser = {
      name: 'Saqib Rana',
      email: 'saqib@example.com',
    }

    await addUser(newUser)
    console.log('✅ User inserted')

    const users = await getAllUsers()
    console.log('📋 All users:', users)
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

run()
