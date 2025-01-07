import { generateStoreToken } from './tokenUtils';

export const getTokenForStore = async (storeId: string) => {
  try {
    const { token, date, expiresAt } = await generateStoreToken(storeId);
    console.log(`Token pour le magasin ${storeId} (${date}):`);
    console.log('Token:', token);
    console.log('Expire le:', new Date(expiresAt).toLocaleString());
    return token;
  } catch (error) {
    console.error('Erreur lors de la génération du token:', error);
    throw error;
  }
};

// Exemple d'utilisation
getTokenForStore('007');