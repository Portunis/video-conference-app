import { ref } from 'vue'
import supabase from '@/shared/supabase/initSupabase'
import { type Provider, type Session } from '@supabase/gotrue-js/dist/main/lib/types'

import type {IAuthForm} from "@/shared/typescripts/";
import { router } from '@/app/provides/router'


const userSession = ref<Session | null>(null)

supabase.auth.onAuthStateChange((event, session) => {
  console.log('session_event', event)
  userSession.value = session
})
/**
 * Обрабатывает вход пользователя по электронной почте + пароль в сеанс supabase.
 * Если пароль не пуст, он отправит волшебную ссылку на адрес электронной почты пользователя
 * @param credentials почта и пароль
 */
async function handleLogin(credentials: IAuthForm) {
  try {
    const { error, data } = await supabase.auth.signInWithPassword({
      email: credentials.email as string,
      password: credentials.password as string
    })
    if (error) {
      console.log('Ошибка', error)
      return { data, error }
    }
    return data
  } catch (error) {
    console.error('Error thrown:', error)
  }
}

/**
 * Обрабатывает регистрацию, предоставленную объектом действительных учетных данных.
 * @param credentials - почта и пароль
 */
async function handleSignup(credentials: IAuthForm) {
  try {
    const { email, password } = credentials
    const { error, data } = await supabase.auth.signUp({ email, password })
    if (error) {
      console.log('Ошибка', error)
      return { data, error }
    }
    return data
  } catch (error) {
    console.error('Error thrown:', error)
  }
}

/**
 * Обрабатывает регистрацию через сторонний логин.
 * https://supabase.com/docs/guides/auth#third-party-logins
 */
async function handleOAuthLogin(provider: Provider) {
  const { error } = await supabase.auth.signInWithOAuth({ provider })
  if (error) console.error('Error: ', error.message)
}

/**
 * Обрабатывает сброс пароля. Отправит электронное письмо на указанный адрес электронной почты.
 */
async function handlePasswordReset() {
  const email = prompt('Please enter your email:')
  if (!email) {
    window.alert('Email address is required.')
  } else {
    const { error } = await supabase.auth.resetPasswordForEmail(email)
    if (error) {
      alert('Error: ' + error.message)
    } else {
      alert('Password recovery email has been sent.')
    }
  }
}

/**
 * Обновляет данные о пользователе
 * @param credentials - новые данные о пользователе
 */
async function handleUpdateUser(credentials: IAuthForm) {
  try {
    const { error } = await supabase.auth.updateUser(credentials)
    if (error) {
      alert('Error updating user info: ' + error.message)
    } else {
      alert('Successfully updated user info!')
      window.location.href = '/'
    }
  } catch (error) {
    alert('Error updating user info: ' + error)
  }
}

/**
 * обрабатывает выход пользователя из сеанса через базу данных
 */
async function handleLogout() {

  console.log('logging out')
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Error', error)
      return
    }
    await router.push('/auth')
  } catch (err) {
    console.error('Error', err)
  }
}

export {
  userSession,
  handleLogin,
  handleOAuthLogin,
  handleSignup,
  handleLogout,
  handlePasswordReset,
  handleUpdateUser
}