/** Web3Forms access key — set `VITE_WEB3FORMS_ACCESS_KEY` in env (Vite exposes only `VITE_*` to the client). */
export const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined

export function isWeb3FormsConfigured(): boolean {
  return Boolean(WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY.length > 8)
}

export async function submitToWeb3Forms(formData: FormData): Promise<{
  success: boolean
  message?: string
}> {
  if (!WEB3FORMS_ACCESS_KEY) {
    return { success: false, message: 'Form relay is not configured.' }
  }
  formData.set('access_key', WEB3FORMS_ACCESS_KEY)

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData,
  })
  const data = (await response.json()) as { success?: boolean; message?: string }
  return { success: Boolean(data.success), message: data.message }
}
