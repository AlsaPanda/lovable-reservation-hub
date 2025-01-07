/**
 * Génère un token pour un magasin donné
 */
export const generateStoreToken = async (storeId: string): Promise<{
  token: string;
  store_id: string;
  date: string;
  expiresAt: string;
}> => {
  // Get today's date in UTC
  const today = new Date();
  const dd = String(today.getUTCDate()).padStart(2, '0');
  const mm = String(today.getUTCMonth() + 1).padStart(2, '0');
  const yyyy = today.getUTCFullYear();
  const dateStr = `${dd}/${mm}/${yyyy}`;

  // Utilisation de la phrase secrète spécifiée
  const secretPhrase = 'CbDH4/fMT14EMpvSJMT79Wc1VzKA63gmS+GSMAroPvTEADqd8SJbTg==';

  // Generate token using native crypto
  const input = `${storeId}-${dateStr}-${secretPhrase}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const token = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Set expiration to end of UTC day
  const expiresAt = new Date(Date.UTC(yyyy, today.getUTCMonth(), today.getUTCDate(), 23, 59, 59, 999));

  return {
    token,
    store_id: storeId,
    date: dateStr,
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