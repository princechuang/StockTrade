import httpUtil from '@/utils/httpUtil';

export function getWxUserInfo(code: string) {
  return httpUtil.get<any>(`/Login/GetWxUserInfo?code=${code}`);
}

export function getWxSignature(url: string) {
  return httpUtil.get<any>(`/My/GetWxSignature?url=${url}`);
}
