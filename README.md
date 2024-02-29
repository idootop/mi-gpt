# MiGPT

> 🏠 Speak to Your Home – MiGPT Makes it Possible.

In a world where home is not just a place but an extension of our digital lives, MiGPT stands as a pioneering force, redefining the essence of smart living. It's not just about automation; it's about creating a home that understands you, responds to you, and evolves with you. With MiGPT, we've crafted an experience that transcends conventional smart home concepts, offering a seamless fusion of the XiaoAI speaker and Mi Home devices with the cutting-edge capabilities of ChatGPT.

## ✨ Highlights

- **Voice-Enabled Omnipresence**: With MiGPT, your voice becomes the universal remote to your living space. Command your environment with the ease of a spoken word, and watch as your home reacts with precision and grace.
- **Intelligent Interactions**: MiGPT doesn't just listen; it understands context, learns preferences, and anticipates needs, turning mundane interactions into meaningful conversations with your home.
- **AI and IoT Symbiosis**: At the core of MiGPT lies the perfect harmony between AI and IoT, creating a bridge between your digital commands and physical devices, ensuring that every element of your home is interconnected and intelligent.
- **Futuristic Home Automation**: Step into the future where MiGPT leads the charge in home automation. It's not just about controlling devices; it's about a home that adapts to your lifestyle, mood, and - Voice-Powered Mastery: Unleash the full potential of your smart home with the power of your voice. MiGPT elevates voice control to new heights, offering unparalleled control over your home's ecosystem.
- **Unprecedented Home Intelligence**: With MiGPT, experience a level of home intelligence that was once the realm of science fiction. Your home doesn't just perform tasks; it thinks, learns, and becomes an integral part of your life.

## ⚡️ Installation

```shell
npm install mi-gpt # coming soon

# or
yarn add mi-gpt

# or
pnpm install mi-gpt
```

## 🔥 Usage

```typescript
import { MiGPT } from "mi-gpt";

async function main() {
  const client = MiGPT.create({
    speaker: {
      userId: process.env.MI_USER,
      password: process.env.MI_PASS,
      did: process.env.MI_DID,
    },
  });
  await client.start();
}

main();
```

## 📦 Docker

Use the following command to start `MiGPT` within a Docker container.

```shell
# Ensure you have your `.env` file and `.migpt.js` configuration file ready for deployment. 
docker run -d  --env-file $(pwd)/.env \
    -v $(pwd)/.migpt.js:/usr/src/app/.migpt.js \
    idootop/mi-gpt:1.0.0
```

## 🌈 Embrace the future

Welcome to the era of intuitive living with MiGPT, where every command is a conversation, and every interaction is an opportunity for your home to become more in sync with you. Imagine a space that not only listens but also comprehends and evolves—a living space that's as dynamic and intelligent as the world around you. This is not just smart home technology; this is MiGPT, the heartbeat of your AI-driven home, where the future of home automation isn't just arriving, it's already here, ready to transform your daily living into an experience of effortless intelligence.

Embrace the revolution. Embrace MiGPT.

## ❤️ Acknowledgement

- https://www.mi.com/
- https://openai.com/
- https://github.com/yihong0618/xiaogpt
- https://github.com/inu1255/mi-service
- https://github.com/Yonsm/MiService
