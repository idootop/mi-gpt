import { HttpsProxyAgent } from "https-proxy-agent";
export const kProxyAgent = process.env.HTTP_PROXY
  ? new HttpsProxyAgent(process.env.HTTP_PROXY)
  : null;
