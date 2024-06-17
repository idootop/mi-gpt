import { BaseSpeaker } from "../services/speaker/base";

export const fastRetry = (speaker: BaseSpeaker, tag: string, maxRetry = 10) => {
  let failed = 0;
  return {
    onResponse(resp: any) {
      if (resp == null) {
        failed += 1;
        if (failed > maxRetry) {
          speaker.logger.error(`获取${tag}异常`);
          return "break";
        }
        if (speaker.debug) {
          speaker.logger.error(`获取${tag}失败，正在重试: ${failed}`);
        }
        return "retry";
      } else {
        failed = 0;
      }
      return "continue";
    },
  };
};
