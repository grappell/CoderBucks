import { writable } from "svelte/store";

const authStore = writable({
  userId: undefined,
  fierbaseOn: false,
  isLogedIn: false,
  isStudent: false,
  studentPath: undefined,
});

export default authStore;
