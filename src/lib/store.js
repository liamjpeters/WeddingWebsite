import { writable } from 'svelte/store'

export const store = writable({
  isLoggedIn: false,
})