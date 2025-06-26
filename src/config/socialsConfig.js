import ethereumLogo from '../assets/imgs/ethereum-logo-white.svg'
import discordLogo from '../assets/imgs/discord-logo.svg'
import farcasterLogo from '../assets/imgs/farcaster-logo.svg'
import twitterLogo from '../assets/imgs/twitter-x-logo.svg'
import telegramLogo from '../assets/imgs/telegram-logo.svg'

export const platforms = {
  wallet: {
    name: 'Wallet',
    icon: ethereumLogo,
    iconBgColor: '#f1584d',
    bubbleButtonStyle: {
      hueRotate: -236,
      saturate: 1.5
    }
  },
  discord: {
    name: 'Discord',
    icon: discordLogo,
    url: 'https://trifle.life/discord',
    bubbleButtonStyle: {
      hueRotate: -345,
      saturate: 2
    }
  },
  farcaster: {
    name: 'Farcaster',
    icon: farcasterLogo,
    url: 'https://trifle.life/farcaster',
    bubbleButtonStyle: {
      hueRotate: -335,
      saturate: 2
    }
  },
  telegram: {
    name: 'Telegram',
    icon: telegramLogo,
    url: 'https://trifle.life/telegram',
    bubbleButtonStyle: {
      hueRotate: -20,
      saturate: 1.5
    }
  },
  twitter: {
    name: 'TwitterX',
    icon: twitterLogo,
    url: 'https://trifle.life/twitter',
    bubbleButtonStyle: {
      hueRotate: 0,
      saturate: 1,
      brightness: 0.95
    }
  }
}
