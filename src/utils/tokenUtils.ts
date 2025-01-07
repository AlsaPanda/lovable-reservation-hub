/**
 * Génère un token pour un magasin donné
 */
export const generateStoreToken = async (storeId: string): Promise<{
  token: string;
  store_id: string;
  date: string;
  expiresAt: string;
}> => {
  // Get today's date in DD/MM/YYYY format
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  const dateStr = `${dd}/${mm}/${yyyy}`;

  // Utilisation d'une phrase secrète par défaut pour la démo
  const secretPhrase = 'demo_secret_phrase';

  // Generate token using native crypto
  const input = `${storeId}-${dateStr}-${secretPhrase}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const token = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return {
    token,
    store_id: storeId,
    date: dateStr,
    expiresAt: new Date(today.setHours(23, 59, 59, 999)).toISOString()
  };
};

/**
 * Vérifie si un token est valide pour un magasin donné
 */
export const validateStoreToken = async (storeId: string, token: string): Promise<boolean> => {
  const { token: expectedToken } = await generateStoreToken(storeId);
  return token === expectedToken;
};