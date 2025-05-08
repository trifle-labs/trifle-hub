export const possiblePoints = [
  {
    name: 'Authenticate Discord Account',
    id: 'auth-discord',
    description: 'Authenticate with Discord to earn 10 pachinko balls and 1 kudzu burn.',
    pachinkoBalls: 10,
    kudzuBurn: 10,
    claimed: false,
    once: true
  },
  {
    name: 'Join Trifle Discord',
    id: 'trifler',
    description: 'Join the server and become a Trifler for 10 pachinko balls',
    pachinkoBalls: 10,
    kudzuBurn: 0,
    claimed: false,
    once: true
  },
  {
    name: 'Authenticate Wallet Address',
    id: 'auth',
    description: 'Authenticate your wallet address.',
    pachinkoBalls: 10,
    kudzuBurn: 10,
    claimed: false,
    once: true
  },
  {
    name: 'Authenticate Email',
    id: 'auth-email',
    description: 'Authenticate with Email to earn 10 pachinko balls and 1 kudzu burn.',
    pachinkoBalls: 10,
    kudzuBurn: 10,
    claimed: false,
    once: true
  },
  {
    name: 'Retweet First Announcement Tweet',
    id: 'retweet-announcement',
    description: 'Retweet the First Announcement Tweet to earn 5 kudzu burn.',
    pachinkoBalls: 5,
    kudzuBurn: 5,
    claimed: false,
    once: true
  },
  {
    name: 'Burn Kudzus',
    id: 'burn-kudzu',
    description: 'Burn a kudzu to earn 1 pachinko ball + 1 kudzu burn.',
    pachinkoBalls: 1,
    kudzuBurn: 1,
    claimed: false,
    once: false
  },
  {
    name: 'Burn NEW Kudzus',
    id: 'burn-unique-kudzu',
    description: "Bonus points when it's the first time you've burned that particular kudzu.",
    pachinkoBalls: 5,
    kudzuBurn: 5,
    claimed: false,
    once: false
  },
  {
    name: 'General Morning Discord Game',
    id: 'gm',
    description:
      'Play the General Morning Game in Discord. Earn 1 pachinko ball for each original greeting and 1 pachinko ball for each reaction someone gives you.',
    pachinkoBalls: 1,
    kudzuBurn: 0,
    claimed: false,
    once: false
  },
  {
    name: 'General Morning Discord Game (React)',
    id: 'gm-react',
    description:
      'Get a react on Discord for your General Morning greeting and earn 1 pachinko ball.',
    pachinkoBalls: 1,
    kudzuBurn: 0,
    claimed: false,
    once: false
  },
  {
    name: 'Blind Run Discord Game',
    id: 'blind-run',
    description:
      'Play the Blind Run Game in Discord. Earn up to 20 pachinko balls for solving the blind maze.',
    pachinkoBalls: '<=20',
    kudzuBurn: 0,
    claimed: false,
    once: false
  },
  {
    name: 'Laugh / Cry Discord Game',
    id: 'flip',
    description: 'Play the Laugh / Cry Game in Discord. Flip a coin and win double or nothing.',
    pachinkoBalls: '2ˣ',
    kudzuBurn: 0,
    claimed: false,
    once: false
  },
  {
    name: 'Bump Discord Game',
    id: 'bump',
    description:
      'Play the Bump Game in Discord. Each 10 pachinko balls for being the last person to bump in an hour, plus 1 pachinko ball for every time someone else bumped. Each bump costs 1 pachinko ball.',
    pachinkoBalls: '>=10',
    kudzuBurn: 0,
    claimed: false,
    once: false
  },
  {
    name: 'Massive Multiplayer Online Rock Paper Scissors',
    id: 'rps',
    description: 'Marketplace dynamics for paper rock scissors played on discord',
    pachinkoBalls: '?',
    kudzuBurn: '0',
    claimed: false,
    once: false
  }
]
