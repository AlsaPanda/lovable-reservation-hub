/**
 * Génère un token pour un magasin donné en utilisant la même logique que le script original
 */
export const generateStoreToken = async (storeId: string): Promise<{
  token: string;
  store_id: string;
  date: string;
  expiresAt: string;
}> => {
  // Get today's date in the same format as the original script (DD/MM/YYYY)
  const now = new Date();
  const date = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  console.log('Date utilisée:', date);

  // Utilisation de la même phrase secrète
  const secretPhrase = 'CbDH4/fMT14EMpvSJMT79Wc1VzKA63gmS+GSMAroPvTEADqd8SJbTg==';
  console.log('Phrase secrète utilisée:', secretPhrase);

  // Préparation de la chaîne à hacher (même format que l'original)
  const dataToHash = `${storeId}-${date}-${secretPhrase}`;
  console.log('Chaîne à hacher:', dataToHash);

  // Generate token using native crypto (équivalent à CryptoJS.SHA256)
  const encoder = new TextEncoder();
  const data = encoder.encode(dataToHash);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const token = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  console.log('Token attendu:', '8755efadd5f9069fb9cf457c9e1e231a64d4d4089357bb94431019cc86e1dd10');
  console.log('Token généré:', token);
  
  if (token !== '8755efadd5f9069fb9cf457c9e1e231a64d4d4089357bb94431019cc86e1dd10') {
    console.log('ATTENTION: Le token généré ne correspond pas au token attendu!');
  }

  // Set expiration to end of UTC day
  const expiresAt = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999));

  return {
    token,
    store_id: storeId,
    date,
    expiresAt: expiresAt.toISOString()
  };
};

/**
 * Vérifie si un token est valide pour un magasin donné
 */
export const validateStoreToken = async (storeId: string, token: string): Promise<boolean> => {
  const { token: expectedToken } = await generateStoreToken(storeId);
  return token === expectedToken;
};