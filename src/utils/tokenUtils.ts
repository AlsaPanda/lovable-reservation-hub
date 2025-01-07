import CryptoJS from 'crypto-js';

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

  // Utilisation de la phrase secrète
  const secretPhrase = 'Dfglkvds554qsfgsd654dgcJu1m';
  console.log('Phrase secrète utilisée:', secretPhrase);

  // Préparation de la chaîne à hacher
  const dataToHash = `${storeId}-${date}-${secretPhrase}`;
  console.log('Chaîne à hacher:', dataToHash);

  // Utilisation de CryptoJS pour générer le hash SHA-256
  const token = CryptoJS.SHA256(dataToHash).toString();
  console.log('Token généré:', token);

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