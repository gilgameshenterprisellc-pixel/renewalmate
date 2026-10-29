// Step-by-step cancellation guides served by app/cancel/[slug].
//
// Every step here comes from the company's own help page, linked as `source`
// and read on `checked`. Nothing is filled in from memory or from third-party
// "how to cancel" sites, which are often out of date and sometimes list fake
// support numbers. If a help page does not say something (for example when
// access ends), the guide does not say it either.
//
// When a company changes its steps, update the guide and `checked` together.

export const CHECKED_ON = 'October 29, 2026'

export interface CancelGuide {
  slug: string
  /** Name as the company writes it. Also matches the card in app/cancel/page.tsx. */
  name: string
  category: string
  /** The official help article the steps come from. */
  source: string
  /** One sentence that answers "how do I cancel X", first thing on the page. */
  answer: string
  /** Steps when you pay the company directly. */
  steps: string[]
  /** Optional heading for `steps` when the company names its own setup. */
  stepsTitle?: string
  /** Other ways people end up billed, each with its own steps. */
  otherBilling: { title: string; steps: string[] }[]
  /** What happens after you cancel, as the help page states it. */
  after: string[]
  /** Worth knowing before you cancel. */
  tips: string[]
}

const APPLE_STEPS = [
  'Open Settings on your iPhone and tap your name.',
  'Tap Subscriptions.',
  'Tap the subscription, then tap Cancel Subscription. If there is no Cancel button, it is already cancelled.',
]

const GOOGLE_PLAY_STEPS = [
  'On a phone or computer, go to g.co/play/subscriptions.',
  'Select the subscription.',
  'Select Cancel subscription and follow the instructions.',
]

export const CANCEL_GUIDES: CancelGuide[] = [
  {
    slug: 'netflix',
    name: 'Netflix',
    category: 'Streaming',
    source: 'https://help.netflix.com/en/node/407',
    answer: 'Go to the Manage your membership page in your Netflix account, select Cancel, then select Finish Cancellation. Netflix emails you a confirmation.',
    steps: [
      'Sign in to Netflix and go to the Manage your membership page.',
      'Select Cancel.',
      'Under Cancel, select Finish Cancellation.',
      'Look for the confirmation email Netflix sends to the address on the account.',
    ],
    otherBilling: [
      {
        title: 'If you don\'t see a Cancel option',
        steps: [
          'You are billed through a payment partner, such as your phone or TV provider or Apple.',
          'Open your Account page and look under Membership. Netflix shows either a link to cancel or instructions to contact your payment partner.',
        ],
      },
    ],
    after: [
      'You won\'t be charged again unless you restart your account.',
      'If you cancel with time left in your billing period, you can keep watching until it ends. Your Payment History shows when the account closes.',
    ],
    tips: [
      'Signing out or deleting the Netflix app does not cancel your membership.',
    ],
  },
  {
    slug: 'spotify',
    name: 'Spotify',
    category: 'Music',
    source: 'https://support.spotify.com/us/article/cancel-premium/',
    answer: 'On your Spotify account page, go to Manage your plan and select Cancel subscription. Premium stays until your next billing date, then your account switches to free.',
    steps: [
      'Sign in to your Spotify account page.',
      'Go to Manage your plan.',
      'Select Cancel subscription.',
    ],
    otherBilling: [
      {
        title: 'If there\'s no option to change your plan',
        steps: [
          'Your plan is billed through a partner company, such as your mobile or internet provider.',
          'Go to Manage your plan and check Payment to find the partner\'s contact link, then cancel with them.',
        ],
      },
      {
        title: 'Family or Duo plans',
        steps: [
          'The plan manager cancels the plan with the steps above. Every member loses Premium from the next payment date.',
          'If you are a member, the steps above only remove you from the plan. Ask the plan manager to cancel.',
        ],
      },
    ],
    after: [
      'Premium stays until your next billing date, then the account switches to Spotify Free.',
      'You keep your playlists and saved music, and you can still listen with ads.',
      'If you cancel during a free trial that cost nothing, the account switches to free right away.',
    ],
    tips: [
      'Still being charged after cancelling? You may have Premium on a second Spotify account. Log out and back in with your other details.',
    ],
  },
  {
    slug: 'amazon-prime',
    name: 'Amazon Prime',
    category: 'Shopping',
    source: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=GTJQ7QZY7QL2HK4Y',
    answer: 'Go to Amazon\'s Cancel Your Prime Membership page and follow the prompts. Prime Video channel subscriptions, like Paramount+, keep running after Prime ends, so cancel those separately.',
    steps: [
      'Sign in to Amazon and open the Cancel Your Prime Membership page (linked from Amazon\'s help article below, or from your Prime Membership page).',
      'Follow the prompts to end the membership.',
      'If you get stuck, go to the Customer Service homepage, select Something else, then I need help with something else.',
    ],
    otherBilling: [
      {
        title: 'Signed up through Google Play on Android',
        steps: GOOGLE_PLAY_STEPS,
      },
      {
        title: 'Prime came with another company\'s service',
        steps: ['Contact that company to cancel your Prime.'],
      },
    ],
    after: [
      'Paid members who haven\'t used their benefits are eligible for a full refund of the current membership period, processed in three to five business days.',
      'Prime Video channel subscriptions, like Paramount+, continue after your Prime membership ends. Cancel them in Your Memberships and Subscriptions.',
    ],
    tips: [
      'Check Your Memberships and Subscriptions before you go, so a channel you forgot about doesn\'t keep billing.',
    ],
  },
  {
    slug: 'disney-plus',
    name: 'Disney+',
    category: 'Streaming',
    source: 'https://help.disneyplus.com/article/disneyplus-cancel',
    answer: 'Log in at DisneyPlus.com in a browser, select your Profile, then Account, select your Disney+ subscription and select Cancel Subscription.',
    steps: [
      'Log in to DisneyPlus.com on a computer or mobile browser.',
      'Select your Profile, then Account.',
      'Under Subscription, select your Disney+ subscription.',
      'Select Cancel Subscription.',
    ],
    otherBilling: [
      {
        title: 'Billed through Apple',
        steps: APPLE_STEPS,
      },
      {
        title: 'Billed through Google Play',
        steps: GOOGLE_PLAY_STEPS,
      },
      {
        title: 'Billed through another partner',
        steps: ['The steps depend on the partner. Go to your billing partner\'s help center or contact them.'],
      },
    ],
    after: [
      'You keep access until the end of your current subscription term. When that is depends on your plan and whether you pay monthly, yearly or are in a promotion.',
      'Cancelling does not delete your Disney+ account or your MyDisney account.',
    ],
    tips: [
      'On a bundle you upgraded to from an existing Hulu, ESPN or HBO Max subscription, cancelling the bundle lets your original subscription continue at its current price. Cancel that one separately if you want it gone too.',
      'Monthly plans billed by Disney+ can be paused instead: Account, your subscription, Pause Subscription.',
    ],
  },
  {
    slug: 'hbo-max',
    name: 'HBO Max',
    category: 'Streaming',
    source: 'https://help.hbomax.com/us/Answer/Detail/000002526',
    answer: 'Go to HBOMax.com/subscription, sign in, choose Cancel Your Subscription and confirm. No cancel option means someone else bills you, such as Apple, Google, Amazon, Roku or your TV provider.',
    stepsTitle: 'If HBO Max bills you directly',
    steps: [
      'Go to HBOMax.com/subscription and sign in.',
      'Check who bills you, shown at the top of the screen.',
      'Choose Cancel Your Subscription.',
      'Confirm, and note your expiration date.',
    ],
    otherBilling: [
      {
        title: 'Billed through Apple',
        steps: APPLE_STEPS,
      },
      {
        title: 'Billed through Google Play',
        steps: GOOGLE_PLAY_STEPS,
      },
      {
        title: 'Billed through Amazon, Roku, Samsung, Xumo or your TV, internet or mobile provider',
        steps: ['Cancel with that company. HBO Max\'s help article links to the steps for each.'],
      },
    ],
    after: [
      'You can keep streaming until the subscription expires at the end of your billing period.',
      'An Extra Member Add-On cancels when your base plan expires, with a prorated refund for any remaining days on the add-on.',
    ],
    tips: [
      'Your subscription renews automatically until you cancel, so cancel before your next billing date.',
      'Deleting the HBO Max app does not cancel your subscription.',
    ],
  },
  {
    slug: 'youtube-premium',
    name: 'YouTube Premium',
    category: 'Streaming',
    source: 'https://support.google.com/youtube/answer/6308278',
    answer: 'Go to youtube.com/paid_memberships, click Manage membership, then Deactivate, Continue to cancel, pick a reason, and Yes, cancel. The same steps cancel YouTube Music Premium.',
    steps: [
      'Go to youtube.com/paid_memberships.',
      'Click Manage membership.',
      'Click Deactivate, then Continue to cancel.',
      'Select your reason and click Next.',
      'Click Yes, cancel.',
    ],
    otherBilling: [
      {
        title: 'Joined from the YouTube app on iPhone (billed by Apple)',
        steps: APPLE_STEPS,
      },
      {
        title: 'Billed through Google Play',
        steps: GOOGLE_PLAY_STEPS,
      },
    ],
    after: [
      'You won\'t be charged again unless you re-subscribe.',
      'Your membership benefits continue until the end of the billing period.',
    ],
    tips: [
      'You can pause or resume a membership instead of cancelling, from the same page.',
      'Not sure it worked? youtube.com/paid_memberships shows whether you have already cancelled.',
    ],
  },
  {
    slug: 'paramount-plus',
    name: 'Paramount+',
    category: 'Streaming',
    source: 'https://help.paramountplus.com/s/article/PD-How-can-I-cancel-my-Paramount-subscription',
    answer: 'On paramountplus.com, click your username in the top right corner, then Account, scroll down and click Cancel subscription. If you signed up through Apple, Google, Amazon, Roku or Prime Video, cancel there instead.',
    stepsTitle: 'Signed up on the web, a smart TV or a game console',
    steps: [
      'Go to paramountplus.com and click your username in the top right corner.',
      'Click Account.',
      'Scroll down and click Cancel subscription.',
    ],
    otherBilling: [
      {
        title: 'Signed up on iPhone or iPad',
        steps: APPLE_STEPS,
      },
      {
        title: 'Signed up on Android or Google TV',
        steps: GOOGLE_PLAY_STEPS,
      },
      {
        title: 'Signed up on Fire TV or through Amazon',
        steps: [
          'Go to amazon.com/appstoresubscriptions and sign in.',
          'Next to Paramount+, select Actions.',
          'Select Cancel your subscription.',
        ],
      },
      {
        title: 'Signed up on Roku',
        steps: [
          'Go to your Roku home screen.',
          'Choose the Paramount+ channel and press the * button on your remote.',
          'Select Manage Subscription, then Cancel Subscription.',
        ],
      },
      {
        title: 'Signed up as a Prime Video channel',
        steps: [
          'In Prime Video, go to Account & Settings and select Your subscriptions.',
          'Find the Paramount+ channel, select Unsubscribe and confirm.',
        ],
      },
    ],
    after: [],
    tips: [
      'Can\'t log in to cancel? Open the Paramount+ Help Center homepage, click the blue chat bubble at the bottom and type "Agent".',
      'Uninstalling the app on an Android TV does not cancel your subscription.',
    ],
  },
  {
    slug: 'peacock',
    name: 'Peacock',
    category: 'Streaming',
    source: 'https://www.peacocktv.com/help/article/cancellation',
    answer: 'Log in to your Peacock account and select Cancel All Subscriptions. That ends your plan and any add-ons at the end of the current term. If you don\'t see that option, a third party such as Apple, Google, Roku or Amazon bills you.',
    steps: [
      'Log in to your Peacock account.',
      'Select Cancel All Subscriptions. This cancels your Select, Premium or Premium Plus plan and every add-on.',
      'Follow the steps to confirm. You\'ll see a confirmation on screen and get an email, which can take a few hours.',
    ],
    otherBilling: [
      {
        title: 'Only removing an add-on',
        steps: [
          'Log in and open the Subscriptions tab.',
          'Select the add-on, then Remove Add-On.',
        ],
      },
      {
        title: 'Billed through Apple, Google, Roku, Amazon or a TV provider',
        steps: ['Peacock can\'t cancel these. Cancel with the company that bills you.'],
      },
    ],
    after: [
      'Your plan won\'t renew at the end of its current subscription term.',
      'Peacock doesn\'t give refunds or credits for earlier payments, unless the law requires it.',
    ],
    tips: [
      'Can\'t log in? Peacock lets you cancel through its chat support.',
    ],
  },
  {
    slug: 'apple-subscriptions',
    name: 'Apple subscriptions',
    category: 'Software',
    source: 'https://support.apple.com/en-us/118428',
    answer: 'On iPhone, open Settings, tap your name, tap Subscriptions, tap the subscription and tap Cancel Subscription. This covers Apple TV, Apple Music and any app subscription you bought through the App Store.',
    stepsTitle: 'On iPhone',
    steps: APPLE_STEPS,
    otherBilling: [
      {
        title: 'Can\'t find the subscription',
        steps: [
          'Search your email for "receipt from Apple" or "invoice from Apple" and check which Apple Account is on it.',
          'If it\'s another Apple Account you use, sign in to that one to cancel.',
          'If it\'s a family member\'s account, they have to cancel it. You can\'t cancel a family member\'s subscription.',
          'No receipt from Apple? Another company bills you. Check your bank or card statement and cancel with them.',
        ],
      },
      {
        title: 'On a Mac, Windows PC, Android or the web',
        steps: ['Apple\'s help article has the steps for each device.'],
      },
      {
        title: 'Through your wireless carrier',
        steps: ['Contact your carrier.'],
      },
    ],
    after: [],
    tips: [
      'Cancelling a free trial? Do it at least 24 hours before the trial ends.',
      'Apps billed through Apple, like a streaming service you subscribed to inside its iPhone app, can only be cancelled here, not on the company\'s website.',
    ],
  },
  {
    slug: 'audible',
    name: 'Audible',
    category: 'Books & Audio',
    source: 'https://help.audible.com/s/article/cancel-membership',
    answer: 'On the Audible website, select your name, then Membership details, then Cancel membership, and Confirm cancellation. Spend your credits first: unused credits are lost when the membership ends.',
    steps: [
      'Sign in on the Audible website and select your name at the top.',
      'Select Membership details.',
      'Select the Cancel membership link.',
      'Select Confirm cancellation. Audible emails you a confirmation.',
    ],
    otherBilling: [
      {
        title: 'Billed through the App Store',
        steps: APPLE_STEPS,
      },
      {
        title: 'Billed through Google Play',
        steps: GOOGLE_PLAY_STEPS,
      },
    ],
    after: [
      'At the end of your final billing cycle, Premium members lose unused credits and member benefits.',
      'Titles you bought with credits or a card stay in your Library for good.',
      'Credits from an App Store or Google Play membership don\'t expire and stay after you cancel.',
    ],
    tips: [
      'Use your credits before you cancel. They expire 12 months after they are issued, or when you cancel.',
      'Don\'t see the cancel option? Check you\'re signed in to the account with the membership.',
      'Deleting the Audible app does not cancel your membership. Some plans can be paused instead.',
    ],
  },
  {
    slug: 'adobe-creative-cloud',
    name: 'Adobe Creative Cloud',
    category: 'Software',
    source: 'https://helpx.adobe.com/account/individual/subscriptions-and-plans/renewals-and-cancellations/cancel-adobe-subscription.html',
    answer: 'Sign in to your Adobe account, choose Manage plan in Plans and payment, select Cancel your plan, and follow it through to Confirm cancellation. Read the cancellation details first: annual plans paid monthly can carry a fee.',
    steps: [
      'Sign in to your Adobe account.',
      'In Plans and payment, select Manage plan for the plan you want to cancel.',
      'Select Cancel your plan, check the plan details, then select Continue to cancel.',
      'Select a reason and Continue.',
      'Review the cancellation details, then select Confirm cancellation.',
    ],
    otherBilling: [
      {
        title: 'Bought through Apple, Google or Microsoft',
        steps: ['Cancel through that store\'s own process.'],
      },
    ],
    after: [
      'Paid apps and services keep working until the end of your current billing period, and you can reactivate before then.',
      'For most plans, cancelling within 14 days of your first purchase gets a full refund.',
    ],
    tips: [
      'Annual plans billed monthly can charge an early cancellation fee after the first 14 days. Read the cancellation details screen carefully before you confirm.',
      'Each plan cancels separately. Cancelling one doesn\'t cancel the others.',
      'Can\'t see Cancel your plan? Adobe may be processing a payment. Wait 24 hours and try again.',
    ],
  },
]

export function guideFor(slug: string): CancelGuide | undefined {
  return CANCEL_GUIDES.find(g => g.slug === slug)
}

// Directory cards whose name differs from the guide that covers them.
const CARD_ALIASES: Record<string, string> = {
  'apple tv+': 'apple-subscriptions',
  'apple music': 'apple-subscriptions',
  'youtube music': 'youtube-premium',
}

/** Guide slug for a directory card, matched by name. */
export function guideSlugForName(name: string): string | undefined {
  const key = name.toLowerCase()
  return CANCEL_GUIDES.find(g => g.name.toLowerCase() === key)?.slug ?? CARD_ALIASES[key]
}
