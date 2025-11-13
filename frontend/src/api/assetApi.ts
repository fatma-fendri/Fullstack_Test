import { Asset } from '../types'

const API_BASE_URL = '/api'

export const assetApi = {
  async getAllAssets(): Promise<Asset[]> {
    const response = await fetch(`${API_BASE_URL}/assets`)
    if (!response.ok) {
      throw new Error('Failed to fetch assets')
    }
    return response.json()
  },

  async getAssetById(id: string): Promise<Asset> {
    const response = await fetch(`${API_BASE_URL}/assets/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch asset')
    }
    return response.json()
  },
}

