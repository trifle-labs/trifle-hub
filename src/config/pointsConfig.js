const discordLink = 'https://discord.gg/aEaEZT9Wr9'
const anybodyLink = 'https://anybody.gg'
const kudzuLink = 'https://kudzu.rodeo'

import discordIcon from '../assets/imgs/discord-logo-90.png'
import walletIcon from '../assets/imgs/ethereum-logo-orange-bg.svg'
import farcasterIcon from '../assets/imgs/farcaster-logo.svg'
import anybodyIcon from '../assets/imgs/anybody-icon.png'
import kudzuIcon from '../assets/imgs/kudzu-icon.gif'

export const possiblePoints = [
  {
    name: 'Link your Discord',
    id: 'auth-discord',
    icon: discordIcon,
    // description: 'Authenticate with Discord to earn 10 pachinko balls and 1 kudzu burn.',
    // description: 'in the Account page',
    pachinkoBalls: 10,
    kudzuBurn: 10,
    claimed: false,
    once: true,
    enabled: true,
    link: { to: 'account' }
  },
  {
    name: 'Link a Wallet',
    id: 'auth-wallet',
    icon: walletIcon,
    // description: 'Authenticate with your wallet address to earn 10 pachinko balls.',
    // description: 'in the Account page',
    pachinkoBalls: 10,
    kudzuBurn: 0,
    claimed: false,
    once: true,
    enabled: true,
    link: { to: 'account' }
  },
  {
    name: 'Link Farcaster',
    id: 'auth-farcaster',
    icon: farcasterIcon,
    // description: 'Authenticate with Farcaster to earn 10 pachinko balls.',
    pachinkoBalls: 10,
    kudzuBurn: 0,
    claimed: false,
    once: true,
    enabled: true,
    link: { to: 'account' }
  },
  {
    name: 'Join Trifle Discord',
    id: 'trifler',
    icon: discordIcon,
    // description: 'Join the server and become a Trifler for 20 pachinko balls',
    pachinkoBalls: 20,
    kudzuBurn: 0,
    claimed: false,
    once: true,
    enabled: true,
    link: discordLink
  },
  // {
  //   name: 'Link Email via Discord',
  //   id: 'auth-email',
  //   description: 'Discord authentication includes email which earns 10 pachinko balls.',
  //   pachinkoBalls: 10,
  //   kudzuBurn: 0,
  //   claimed: false,
  //   once: true,
  //   enabled: true,
  //   link: { to: 'account' }
  // },
  // {
  //   name: 'Retweet First Announcement Tweet',
  //   id: 'retweet-0-announcement',
  //   description: 'Retweet the First Announcement Tweet to earn 5 kudzu burn.',
  //   pachinkoBalls: 5,
  //   kudzuBurn: 5,
  //   claimed: false,
  //   once: true,
  //   enabled: false,
  //   link: null
  // },
  // {
  //   name: 'Burn NEW Kudzus',
  //   id: 'burn-unique-kudzu',
  //   description: "Bonus points when it's the first time you've burned that particular kudzu.",
  //   pachinkoBalls: 5,
  //   kudzuBurn: 5,
  //   claimed: false,
  //   once: false,
  //   enabled: true,
  //   link: 'https://kudzu.rodeo'
  // },
  {
    name: 'Play gm-game in Discord',
    id: 'gm',
    icon: discordIcon,
    description: 'Every unique "Good Morning" you write in Discord earns +1 pachinko ball',
    pachinkoBalls: '1+',
    kudzuBurn: 0,
    claimed: false,
    once: false,
    enabled: true,
    link: discordLink
  },
  {
    name: "Emoji added to your 'gm'",
    id: 'gm-react',
    icon: discordIcon,
    description: 'Everytime someone adds an emoji to your "gm" message, you earn +1',
    pachinkoBalls: '1+',
    kudzuBurn: 0,
    claimed: false,
    once: false,
    enabled: true,
    link: discordLink
  },
  {
    name: 'Beat Anybody Problem',
    id: 'solve-anybody',
    description: 'A new problem every day on <u>anybody.gg</u>',
    icon: anybodyIcon,
    pachinkoBalls: '10/day',
    kudzuBurn: 0,
    claimed: false,
    once: false,
    enabled: false,
    link: anybodyLink
  },
  {
    name: "Mint today's Anybody Problem NFT",
    id: 'mint-anybody-nft',
    icon: anybodyIcon,
    description: 'Bonus balls for minting the daily NFT!',
    pachinkoBalls: '10/day',
    kudzuBurn: 0,
    claimed: false,
    once: false,
    enabled: false,
    link: anybodyLink
  },
  {
    name: 'Win Daily Speedy in Anybody Problem',
    id: 'win-speedy-record',
    icon: anybodyIcon,
    description: 'Finish fastest of the day!',
    pachinkoBalls: 25,
    kudzuBurn: 0,
    claimed: false,
    once: false,
    enabled: false,
    link: anybodyLink
  },
  {
    name: 'Burn Kudzus',
    id: 'burn-kudzu',
    icon: kudzuIcon,
    description: 'Every Kudzu NFT burned earns kudzu points and a pachinko ball',
    pachinkoBalls: 1,
    kudzuBurn: 1,
    claimed: false,
    once: false,
    enabled: false,
    link: kudzuLink
  },
  {
    name: 'Nuke to 1st on Kudzus',
    id: 'nuke-kudzu',
    icon: kudzuIcon,
    description: 'Nuke to 1st place and earn bonus balls!',
    pachinkoBalls: 100,
    kudzuBurn: 0,
    claimed: false,
    once: true,
    enabled: false,
    link: kudzuLink + '/nuke'
  },
  // {
  //   name: 'Blind Run Discord Game',
  //   id: 'blind-run',
  //   description:
  //     'Play the Blind Run Game in Discord. Earn up to 20 pachinko balls for solving the blind maze.',
  //   pachinkoBalls: '<=20',
  //   kudzuBurn: 0,
  //   claimed: false,
  //   once: false,
  //   enabled: false,
  //   link: discordLink
  // },
  {
    name: "Play '/laughcry' in Discord",
    id: 'flip',
    icon: discordIcon,
    description: 'Ride a wave of double or nothing coin flips',
    pachinkoBalls: '2ˣ',
    kudzuBurn: 0,
    claimed: false,
    once: false,
    enabled: true,
    link: discordLink
  },
  // {
  //   name: 'Bump Discord Game',
  //   id: 'bump',
  //   description:
  //     'Play the Bump Game in Discord. Each 10 pachinko balls for being the last person to bump in an hour, plus 1 pachinko ball for every time someone else bumped. Each bump costs 1 pachinko ball.',
  //   pachinkoBalls: '>=10',
  //   kudzuBurn: 0,
  //   claimed: false,
  //   once: false,
  //   enabled: true,
  //   link: discordLink
  // },
  {
    name: 'Follow Trifle on Farcaster',
    id: 'follow-trifle-farcaster',
    icon: farcasterIcon,
    description: 'Follow Trifle on Farcaster to earn 10 pachinko balls',
    pachinkoBalls: 25,
    kudzuBurn: 0,
    claimed: false,
    once: true,
    enabled: false,
    link: 'https://warpcast.com/trifle'
  }
  // {
  //   name: 'Massive Multiplayer Online Rock Paper Scissors',
  //   id: 'rps',
  //   description: 'Marketplace dynamics for paper rock scissors played on discord',
  //   pachinkoBalls: '?',
  //   kudzuBurn: '0',
  //   claimed: false,
  //   once: false,
  //   enabled: false,
  //   link: discordLink
  // }
]
