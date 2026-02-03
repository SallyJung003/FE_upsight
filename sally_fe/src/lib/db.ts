// src/lib/db.ts
import fs from 'fs/promises'
import path from 'path'
import { Product } from '@/types/product'
import { products as mockProducts } from '@/mocks/data'

const DB_PATH = path.join(process.cwd(), 'data', 'products.json')

async function ensureDbFile() {
    try {
        await fs.access(DB_PATH)
    } catch {
        await fs.mkdir(path.dirname(DB_PATH), { recursive: true })
        await fs.writeFile(
            DB_PATH,
            JSON.stringify({
                products: mockProducts,  // ← mocks/data.ts의 products 사용
                nextId: 4
            }, null, 2)
        )
    }
}

export async function getProducts(): Promise<Product[]> {
    await ensureDbFile()
    const data = await fs.readFile(DB_PATH, 'utf-8')
    const { products } = JSON.parse(data)
    return products
}

export async function getProductById(id: string): Promise<Product | null> {
    const products = await getProducts()
    return products.find(p => p.id === id) || null
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    await ensureDbFile()
    const data = await fs.readFile(DB_PATH, 'utf-8')
    const db = JSON.parse(data)

    const newProduct: Product = {
        ...product,
        id: String(db.nextId),
        createdAt: new Date().toISOString()
    }

    db.products.push(newProduct)
    db.nextId += 1

    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2))
    return newProduct
}

export async function deleteProduct(id: string): Promise<boolean> {
    await ensureDbFile()
    const data = await fs.readFile(DB_PATH, 'utf-8')
    const db = JSON.parse(data)

    const index = db.products.findIndex((p: Product) => p.id === id)
    if (index === -1) return false

    db.products.splice(index, 1)
    await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2))
    return true
}
