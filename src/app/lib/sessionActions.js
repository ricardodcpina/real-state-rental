'use server';

import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const key = new TextEncoder().encode(process.env.HASH_SECRET);

export async function getSession() {
  const session = cookies().get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}

export async function decrypt(session) {
  const { payload } = await jwtVerify(session, key, { algorithms: ['HS256'] });
  return payload;
}

// async function updateSession(request) {
//     getSession
//     check
//     decrypt
//     refresh expiry time
//     set cookies in response with new session
//   }

// async function encrypt(session) {
//   const token = await new SignJWT({ sub: userId })
//     .setProtectedHeader({ alg: 'HS256' })
//     .setIssuedAt()
//     .setExpirationTime('60s')
//     .sign(key);

//   return token;
// }
