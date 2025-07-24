export async function hashPassword(password: string, salt: string): Promise<string> {
    // Gunakan Web Crypto API yang tersedia di Edge Runtime
    const encoder = new TextEncoder()
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        encoder.encode(password.normalize()),
        'PBKDF2',
        false,
        ['deriveBits']
    )
    
    const derivedBits = await crypto.subtle.deriveBits(
        {
            name: 'PBKDF2',
            salt: encoder.encode(salt),
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        512 // 64 bytes = 512 bits
    )
    
    return Array.from(new Uint8Array(derivedBits))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
}

export async function comparePassword({
    password,
    salt,
    hashedPassword
}: {
    password: string,
    salt: string,
    hashedPassword: string
}) {
    const inputHashedPassword = await hashPassword(password, salt)
    
    // Timing-safe comparison menggunakan Web Crypto
    const inputBuffer = new TextEncoder().encode(inputHashedPassword)
    const storedBuffer = new TextEncoder().encode(hashedPassword)
    
    if (inputBuffer.length !== storedBuffer.length) {
        return false
    }
    
    // Simple timing-safe equal untuk Edge Runtime
    let result = 0
    for (let i = 0; i < inputBuffer.length; i++) {
        result |= inputBuffer[i] ^ storedBuffer[i]
    }
    
    return result === 0
}

export function generateSalt(): string {
    // Gunakan Web Crypto API
    const array = new Uint8Array(16)
    crypto.getRandomValues(array)
    return Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
}