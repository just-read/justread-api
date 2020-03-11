import axios from 'axios';

export const isISBN = (text: string): boolean => {
  const isbnRegexp = new RegExp(/^\d{13}$/);
  if (isbnRegexp.test(text)) {
    return true;
  }
  return false;
};

interface VeryfyGoogleToken {
  originEmail: string;
  originGoogleId: string;
  tokenId: string;
}

interface GoogleTokenInfoResponse {
  iss: string;
  azp: string;
  aud: string;
  sub: string;
  email: string;
  email_verified: string;
  at_hash: string;
  name: string;
  picture: string;
  given_name: string;
  family_name: string;
  locale: string;
  iat: string;
  exp: string;
  jti: string;
  alg: string;
  kid: string;
  typ: string;
}

/**
 *
 * @param originEmail 요청 받은 이메일
 * @param originGoogleId 요청 받은 구글 ID
 * @param tokenId 요청 받은 구글 토큰 ID
 * @return 요청값 검증 일치 여부
 */
export const verifyGoogleToken = async ({
  originEmail,
  originGoogleId,
  tokenId,
}: VeryfyGoogleToken): Promise<boolean> => {
  const {
    data: { email, sub: googleId },
  } = await axios.get<GoogleTokenInfoResponse>(
    `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${tokenId}`,
  );
  if (originEmail === email && originGoogleId === googleId) {
    return true;
  }
  return false;
};
