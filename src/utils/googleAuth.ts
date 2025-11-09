export const generateAndStoreNonce = async (): Promise<string> => {
  const nonce = btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(32))))
  localStorage.setItem('google_nonce', nonce)
  return nonce
}
