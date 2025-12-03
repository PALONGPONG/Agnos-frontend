const DEFAULT_SOCKET_URL = 'ws://localhost:4000'

export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL ?? DEFAULT_SOCKET_URL
