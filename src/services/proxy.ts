import { HttpsProxyAgent } from "https-proxy-agent";
import { SocksProxyAgent } from "socks-proxy-agent";

const httpProxy = process.env.HTTP_PROXY;
const socksProxy = process.env.SOCKS_PROXY;

export const kProxyAgent = httpProxy
    ? new HttpsProxyAgent(httpProxy)
    : socksProxy
        ? new SocksProxyAgent(socksProxy)
        : null;
