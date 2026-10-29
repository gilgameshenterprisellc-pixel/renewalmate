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
  /** What `source` is, when it is not a help page. */
  sourceLabel?: string
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
  {
    slug: 'hulu',
    name: 'Hulu',
    category: 'Streaming',
    source: 'https://help.hulu.com/article/hulu-cancel-hulu-subscription',
    answer: 'Open your Hulu Account page in a browser, select Cancel under Your Subscription, select Continue to Cancel if Hulu offers a pause, then select Cancel Subscription.',
    steps: [
      'On a computer or mobile browser, sign in to Hulu and open your Account page.',
      'Select Cancel under Your Subscription.',
      'If Hulu offers to pause your subscription instead, select Continue to Cancel.',
      'Select Cancel Subscription.',
      'Check that your Account page now reads "Your subscription will be canceled." and keep the confirmation email Hulu sends.',
    ],
    otherBilling: [
      {
        title: 'Billed by another company',
        steps: [
          'Hulu lists Amazon, Apple, Comcast Xfinity, Disney, Google, Kroger, HBO Max, Optimum, Roku, Spotify, T-Mobile and Verizon as billing partners, and the steps differ for each.',
          'Your Hulu Account page shows who bills you in the Payment Information section. Cancel with that company, and contact it if you get stuck.',
        ],
      },
      {
        title: 'A bundle you bought through Disney+ or HBO Max',
        steps: ['Manage it where you bought it. A bundle bought through Disney+ is managed in Disney+, and a Disney+, Hulu, HBO Max bundle bought through HBO Max is managed in HBO Max.'],
      },
    ],
    after: [
      'You keep Hulu until the end of your current billing cycle and are not charged again.',
      'If you cancel during a free trial, you keep access and are not charged when the trial ends. Hulu + Live TV trials are the exception: they end as soon as you cancel.',
      'Cancelling does not delete your Hulu account or your Disney account. You can sign up again later with the same login.',
    ],
    tips: [
      'Hulu-billed subscribers may be able to pause for up to 12 weeks instead.',
      'To drop an add-on or move to a different plan, you can change your plan without cancelling.',
      'On a bundle you upgraded to from an existing Disney+, ESPN+ or HBO Max subscription, cancelling the bundle lets your original subscription continue at its current price. Cancel that one separately if you want it gone too.',
    ],
  },
  {
    slug: 'chatgpt-plus',
    name: 'ChatGPT Plus',
    category: 'Software',
    source: 'https://help.openai.com/en/articles/7232927-canceling-your-chatgpt-subscription',
    answer: 'On chatgpt.com, open your account menu, select Settings, then Billing, and select Cancel under Cancel plan. If you subscribed in the iPhone or Android app, cancel through Apple or Google Play instead.',
    stepsTitle: 'If you subscribed on chatgpt.com',
    steps: [
      'Sign in to ChatGPT at chatgpt.com.',
      'Open your account menu and select Settings.',
      'Select Billing.',
      'Under Cancel plan, select Cancel.',
    ],
    otherBilling: [
      {
        title: 'Subscribed in the iPhone or iPad app (billed by Apple)',
        steps: [
          'Open Settings and select your name.',
          'Select Subscriptions, then ChatGPT.',
          'Select Cancel Subscription and confirm. If there is no Cancel button and an end date shows, it may already be cancelled.',
        ],
      },
      {
        title: 'Subscribed through Google Play',
        steps: [
          'Make sure you are signed in to the Google account you subscribed with.',
          'In the Google Play Store app, open Subscriptions and select ChatGPT. On the web, open your Google Play subscriptions and select Manage next to ChatGPT.',
          'Select Cancel subscription and confirm.',
        ],
      },
    ],
    after: [
      'Paid features stay on until the end of your current billing period.',
      'Cancelling stops future renewals. It does not refund past charges on its own.',
    ],
    tips: [
      'Cancel at least 24 hours before your next billing date, or that charge may already go through.',
      'Uninstalling the app does not cancel. Deleting your ChatGPT account cancels a subscription billed by ChatGPT but not one billed by Apple, so cancel through Apple first.',
      'If billing controls are missing on chatgpt.com, sign in to the same account in a different browser and try again.',
      'Can\'t sign in? For a subscription billed by ChatGPT, OpenAI Support can cancel it if you give the account or billing email plus two of these: your card\'s last four digits, its expiration date, the billing address, or the date of the latest charge. Never send the full card number.',
      'A self-service ChatGPT Business plan is cancelled from Workspace settings, Billing, Manage plan, Cancel subscription. If you can\'t see billing settings, ask your workspace owner.',
    ],
  },
  {
    slug: 'xbox-game-pass',
    name: 'Xbox Game Pass',
    category: 'Gaming',
    source: 'https://support.xbox.com/en-US/help/subscriptions-billing/manage-subscriptions/cancel-recurring-billing-or-subscription',
    answer: 'Go to account.microsoft.com/services, sign in with the Microsoft account that bought Game Pass, select Manage next to it, then select Cancel subscription. On a console, it is under Profile & system, Settings, Account, Subscriptions.',
    steps: [
      'In a phone or computer browser, go to account.microsoft.com/services and sign in with the Microsoft account you bought the subscription with.',
      'Find Game Pass and select Manage.',
      'Select Cancel subscription and follow the instructions.',
      'If you\'re eligible for a refund, you\'ll see an option to cancel right away with a refund.',
    ],
    otherBilling: [
      {
        title: 'Billed by another company',
        steps: ['If a third party bills you for the subscription, contact that company to cancel or ask about a refund.'],
      },
    ],
    after: [
      'Turning off recurring billing stops future charges. You keep the benefits until the subscription\'s expiration date.',
      'Not every subscription charge can be refunded.',
    ],
    tips: [
      'On an Xbox console: press the Xbox button, go to Profile & system, Settings, Account, Subscriptions, choose the subscription and select Cancel subscription.',
      'If you see Turn on recurring billing instead of Manage, the subscription is already set to end on the date shown and you won\'t be charged after it.',
      'Sign in with the same Microsoft account you bought Game Pass with. Xbox\'s help page stresses this.',
    ],
  },
  {
    slug: 'playstation-plus',
    name: 'PlayStation Plus',
    category: 'Gaming',
    source: 'https://www.playstation.com/en-us/support/subscriptions/cancel-playstation-plus/',
    answer: 'Sign in to Account Management on the PlayStation website, select Subscription from the menu on the left, then select Cancel Subscription next to PlayStation Plus. On a PS5, it is under Settings, Users and Accounts.',
    stepsTitle: 'In a web browser',
    steps: [
      'Sign in to Account Management on the PlayStation website.',
      'Select Subscription from the menu on the left.',
      'Select Cancel Subscription next to PlayStation Plus.',
    ],
    otherBilling: [],
    after: [
      'You keep every PlayStation Plus benefit until the end of the period you already paid for.',
      'When it ends, you lose PlayStation Plus benefits such as monthly games, online storage and online multiplayer.',
      'Games you downloaded at no cost through PlayStation Plus, like the monthly games, stop being available. Redeemed PlayStation Plus packs and avatars, and anything you bought at a PlayStation Plus discount, are yours to keep.',
    ],
    tips: [
      'On a PS5: Settings, Users and Accounts, Account, Payment and Subscriptions, Subscriptions, PlayStation Plus, then Cancel Subscription.',
      'Changed your mind? Select Reactivate Subscription before your next payment date to keep it.',
      'You can switch to a different PlayStation Plus plan instead of cancelling.',
    ],
  },
  {
    slug: 'microsoft-365',
    name: 'Microsoft 365',
    category: 'Software',
    source: 'https://support.microsoft.com/en-us/accounts-billing/subscriptions/cancel-a-microsoft-365-subscription',
    answer: 'Go to account.microsoft.com/services/microsoft365, sign in with the account that bought it, select Cancel subscription (it may say Upgrade or Cancel), review the page, then select I don\'t want my subscription at the bottom.',
    steps: [
      'Go to account.microsoft.com/services/microsoft365 and sign in with the Microsoft account you bought Microsoft 365 with.',
      'Select Cancel subscription. It might say Upgrade or Cancel.',
      'Read the Please review section at the top of the cancel page. It may show cheaper plans.',
      'At the bottom of the page, select I don\'t want my subscription.',
    ],
    otherBilling: [
      {
        title: 'Bought through Apple',
        steps: APPLE_STEPS,
      },
      {
        title: 'Bought through Google Play',
        steps: GOOGLE_PLAY_STEPS,
      },
      {
        title: 'Bought from a retailer such as Amazon',
        steps: ['Contact that retailer directly to manage the subscription and billing.'],
      },
    ],
    after: [
      'Your storage drops back to the free amount: 5GB of cloud storage shared by OneDrive and Outlook.com attachments, plus 15GB of Outlook.com mail storage.',
      'On Microsoft 365 Family or Premium, everyone you shared it with loses the extra storage too.',
      'If you are over the free amount, you can\'t upload, edit or sync new files to OneDrive or send and receive Outlook.com email, and after 6 months Microsoft may delete your OneDrive and everything in it.',
    ],
    tips: [
      'If you use more than the free 5GB, move or back up your OneDrive files first.',
      'If you see Turn on recurring billing instead of a cancel option, it is already set to end on the date shown and you won\'t be charged after it.',
      'Not every cancellation gets a refund. You find out whether yours qualifies by cancelling first.',
      'If you just want a cheaper plan, you can switch plans instead.',
    ],
  },
  {
    slug: 'planet-fitness',
    name: 'Planet Fitness',
    category: 'Fitness',
    source: 'https://www.planetfitness.com/about-planet-fitness/customer-service',
    answer: 'Planet Fitness lists three ways to end a membership: log in to the member portal on planetfitness.com, visit your home club, or mail a written request to your home club. Do it at least 7 days before your next billing date.',
    stepsTitle: 'Three ways to end your membership',
    steps: [
      'Online: log in to your account through the member portal on planetfitness.com.',
      'In person: visit your home club.',
      'By mail: send your home club a written request to end your membership.',
    ],
    otherBilling: [],
    after: [],
    tips: [
      'Cancel at least 7 days before your next billing date to stop the next monthly charge, and at least 7 days before your annual fee date to stop the annual fee.',
      'If your membership has a minimum term and you end it early, Planet Fitness charges a $58 buyout fee.',
      'Your billing dates are in the member portal and on your membership agreement.',
      'Some policies vary by location under state and local rules. Your home club can answer questions about yours.',
    ],
  },
  {
    slug: 'uber-one',
    name: 'Uber One',
    category: 'Delivery',
    source: 'https://www.uber.com/us/en/legal/renewable-passes-terms/',
    sourceLabel: 'US membership terms',
    answer: 'In the Uber app you bought it in, open the Uber One section, select Manage Membership, then End membership, and confirm.',
    steps: [
      'Open the Uber app you bought Uber One in.',
      'Go to the Uber One section.',
      'Select Manage Membership.',
      'Select End membership, then confirm you want to cancel.',
    ],
    otherBilling: [
      {
        title: 'Uber One from another company\'s promotion',
        steps: ['A partner that gave you Uber One may handle its payments and cancellation. Check with that company.'],
      },
    ],
    after: [
      'You keep Uber One benefits until the end of the current billing cycle.',
      'On a free trial, benefits end as soon as you cancel. A trial that came from a partner promotion lasts as long as that promotion.',
      'Uber One credits you earned can\'t be used without an active membership, and they expire at the end of that membership cycle.',
    ],
    tips: [
      'Uber charges the renewal up to 24 hours before your renewal day. If you cancel in that window after the charge, Uber refunds that payment automatically.',
      'A monthly payment already charged for the current cycle is not refunded or prorated when you cancel partway through.',
      'Report charges you didn\'t authorize at help.uber.com within 60 days.',
      'Uber\'s help articles differ by country, so these steps come from its US membership terms.',
    ],
  },
  {
    slug: 'doordash-dashpass',
    name: 'DoorDash DashPass',
    category: 'Delivery',
    source: 'https://help.doordash.com/en-us/consumers/article/how-do-i-cancel-my-dashpass-subscription',
    answer: 'In the DoorDash app or on doordash.com, tap the account icon, go to Manage DashPass, tap Cancel Membership, pick a reason, then select Cancel DashPass. Do it at least 24 hours before your next payment.',
    steps: [
      'Open the DoorDash app or go to doordash.com.',
      'Tap the account icon.',
      'Go to Manage DashPass.',
      'Tap Cancel Membership.',
      'Pick a reason for cancelling and select Select reason.',
      'Select Cancel DashPass, then Got it.',
    ],
    otherBilling: [],
    after: [
      'Your DashPass benefits last through the end of the current billing period.',
      'If you cancel during a free period, the benefits end right away.',
      'DoorDash emails you to confirm the cancellation.',
    ],
    tips: [
      'Cancel at least 24 hours before your next scheduled payment to avoid being charged for the next period.',
      'You can pause instead: on the Manage DashPass page, select Pause Membership, then Pause DashPass.',
    ],
  },
  {
    slug: 'siriusxm',
    name: 'SiriusXM',
    category: 'Audio',
    source: 'https://www.siriusxm.com/help/manage-or-cancel-service',
    answer: 'If SiriusXM bills you directly, cancel in the Subscriptions tab of your SiriusXM Online Account Center, in an online chat with an agent, or by calling 866-635-8641. If Apple, Google Play, Roku or T-Mobile bills you, cancel with them.',
    stepsTitle: 'If SiriusXM bills you directly',
    steps: [
      'Go to the Subscriptions tab in your SiriusXM Online Account Center and cancel there.',
      'Or chat with a SiriusXM agent online.',
      'Or call 866-635-8641. SiriusXM\'s Contact Us page lists the call center hours.',
    ],
    otherBilling: [
      {
        title: 'Bought in the SiriusXM app on an iPhone or iPad (billed by Apple)',
        steps: APPLE_STEPS,
      },
      {
        title: 'Bought in the SiriusXM app on Android or Android TV (billed by Google Play)',
        steps: GOOGLE_PLAY_STEPS,
      },
      {
        title: 'Bought in the SiriusXM app on Roku',
        steps: [
          'On a computer or phone, go to my.roku.com and sign in. You can\'t cancel inside the SiriusXM app.',
          'Select manage your subscriptions.',
          'Find SiriusXM under active subscriptions, select cancel subscription and pick a reason.',
        ],
      },
      {
        title: 'Billed by T-Mobile',
        steps: [
          'Log in to T-Mobile.com or the T-Mobile app.',
          'On the website: under I want to, choose Manage add-ons, select your account and phone number, then Manage Add-ons. In the app: Account, then Manage Data and Add-ons.',
          'Deselect the SiriusXM feature, choose Continue, then Agree & Submit on the Review your order page.',
        ],
      },
    ],
    after: [
      'A subscription billed by Apple or Google Play stops at the end of the current billing cycle.',
    ],
    tips: [
      'With Apple or Google Play, cancel more than 24 hours before your renewal date or it might renew.',
      'Deleting the SiriusXM app does not cancel your subscription, and unfollowing a podcast does not cancel SiriusXM Podcasts+.',
      'SiriusXM Podcasts+ bought through Apple Podcasts is cancelled with Apple.',
    ],
  },
  {
    slug: 'kindle-unlimited',
    name: 'Kindle Unlimited',
    category: 'Books & Audio',
    source: 'https://www.amazon.com/gp/help/customer/display.html?nodeId=GLSQ4722655M4ZEJ',
    answer: 'Amazon\'s Kindle Unlimited help pages now call it Kindle+. Go to amazon.com/kindle-dbs/hz/cancel, sign in and select Cancel membership. You keep access until your next billing date.',
    steps: [
      'Go to Amazon\'s Cancel Kindle+ page, amazon.com/kindle-dbs/hz/cancel, and sign in to your Amazon account.',
      'Select Cancel membership.',
    ],
    otherBilling: [
      {
        title: 'Signed up through Google Play',
        steps: GOOGLE_PLAY_STEPS,
      },
    ],
    after: [
      'Your membership stays active until the next billing date.',
      'After that date, you lose access to the titles you have checked out.',
    ],
    tips: [
      'You can pause a monthly subscription for one month instead. The pause starts at the end of your billing cycle and the subscription resumes on its own, or you can resume it early from Kindle+ Central. You can\'t pause during a free trial or promotional period.',
      'A prepaid membership from a gift or bundle does not get a partial refund for unused months.',
      'A free trial turns into a paid monthly plan automatically when it ends.',
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
