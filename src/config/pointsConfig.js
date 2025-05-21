const discordLink = 'https://discord.gg/aEaEZT9Wr9'
const anybodyLink = 'https://anybody.gg'
const kudzuLink = 'https://kudzu.rodeo'

export const possiblePoints = [
  {
    name: 'Authenticate Discord Account',
    id: 'auth-discord',
    description: 'Authenticate with Discord to earn 10 pachinko balls and 1 kudzu burn.',
    pachinkoBalls: 10,
    kudzuBurn: 10,
    claimed: false,
    once: true,
    enabled: true,
    link: { to: 'account' }
  },
  {
    name: 'Authenticate Wallet Address',
    id: 'auth-wallet',
    description: 'Authenticate with your wallet address to earn 10 pachinko balls.',
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
    description: 'Join the server and become a Trifler for 10 pachinko balls',
    pachinkoBalls: 10,
    kudzuBurn: 0,
    claimed: false,
    once: true,
    enabled: true,
    link: discordLink
  },
  {
    name: 'Authenticate Farcaster',
    id: 'auth-farcaster',
    description: 'Authenticate with Farcaster to earn 10 pachinko balls.',
    pachinkoBalls: 10,
    kudzuBurn: 0,
    claimed: false,
    once: true,
    enabled: false
  },
  {
    name: 'Authenticate Email via Discord',
    id: 'auth-email',
    description: 'Discord authentication includes email which earns 10 pachinko balls.',
    pachinkoBalls: 10,
    kudzuBurn: 0,
    claimed: false,
    once: true,
    enabled: true,
    link: { to: 'account' }
  },
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
    name: 'General Morning Discord Game',
    id: 'gm',
    description:
      'Play the General Morning Game in Discord. Earn 1 pachinko ball for each original greeting and 1 pachinko ball for each reaction someone gives you.',
    pachinkoBalls: 1,
    kudzuBurn: 0,
    claimed: false,
    once: false,
    enabled: true,
    link: discordLink
  },
  {
    name: 'General Morning Discord Game (React)',
    id: 'gm-react',
    description:
      'Get a react on Discord for your General Morning greeting and earn 1 pachinko ball.',
    pachinkoBalls: 1,
    kudzuBurn: 0,
    claimed: false,
    once: false,
    enabled: true,
    link: discordLink
  },
  {
    name: "Solve today's Anybody Problem",
    id: 'solve-anybody',
    description: "Solve today's Anybody Problem to earn 10 pachinko balls.",
    pachinkoBalls: 10,
    kudzuBurn: 0,
    claimed: false,
    once: false,
    enabled: false,
    link: anybodyLink
  },
  {
    name: "Mint today's Anybody Problem NFT",
    id: 'mint-anybody-nft',
    description: "Mint today's Anybody Problem NFT to earn 1 pachinko ball.",
    pachinkoBalls: 10,
    kudzuBurn: 0,
    claimed: false,
    once: false,
    enabled: false,
    link: anybodyLink
  },
  {
    name: 'Win Daily Speedy Record in Anybody Problem',
    id: 'win-speedy-record',
    description: 'Win Daily Speedy Record in Anybody Problem to earn 10 pachinko balls.',
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
    description: 'Burn a kudzu to earn +1 pachinko ball +1 kudzu burn.',
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
    description: 'Nuke to 1st on Kudzus to earn 100 pachinko balls.',
    pachinkoBalls: 100,
    kudzuBurn: 0,
    claimed: false,
    once: true,
    enabled: false,
    link: kudzuLink
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
    name: 'Laugh / Cry Discord Game',
    id: 'flip',
    description: 'Play the Laugh / Cry Game in Discord. Flip a coin and win double or nothing.',
    pachinkoBalls: '2ˣ',
    kudzuBurn: 0,
    claimed: false,
    once: false,
    enabled: true,
    link: discordLink
  },
  {
    name: 'Bump Discord Game',
    id: 'bump',
    description:
      'Play the Bump Game in Discord. Each 10 pachinko balls for being the last person to bump in an hour, plus 1 pachinko ball for every time someone else bumped. Each bump costs 1 pachinko ball.',
    pachinkoBalls: '>=10',
    kudzuBurn: 0,
    claimed: false,
    once: false,
    enabled: true,
    link: discordLink
  },
  {
    name: 'Follow Trifle on Farcaster',
    id: 'follow-trifle-farcaster',
    description: 'Follow Trifle on Farcaster to earn 10 pachinko balls.',
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
