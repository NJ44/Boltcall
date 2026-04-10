import React, { useState, useEffect } from 'react';
import { updateMetaDescription } from '../lib/utils';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GiveawayBar from '../components/GiveawayBar';

// ===== DATA =====
interface ObjectionStep {
  label: string;
  script: string;
}

interface Objection {
  quote: string;
  frequency: string;
  difficulty: 'easy' | 'medium' | 'hard';
  steps: ObjectionStep[];
  tip: string;
}

interface FlowStep {
  phase: string;
  title: string;
  time: string;
  sayBlocks: { type: 'say' | 'do' | 'text'; content: string }[];
}

interface ClosingTechnique {
  icon: string;
  colorClass: string;
  bgClass: string;
  name: string;
  when: string;
  dialogue: { speaker: 'you' | 'them'; text: string }[];
}

interface PracticeScenario {
  quote: string;
  context: string;
  answer: string;
}

const objections: Objection[] = [
  {
    quote: '"It\'s too expensive."',
    frequency: 'Heard on 72% of calls',
    difficulty: 'easy',
    steps: [
      { label: 'Agree & Validate', script: '"I totally get that — it\'s a big investment. Most of our best customers said the same thing initially."' },
      { label: 'Reframe to Cost of Inaction', script: '"Let me ask — how much are you paying for electricity right now per month? <em>(wait for answer)</em> So that\'s about $X per year just going to the utility company, with rates going up 3–5% every year."' },
      { label: 'Show the Math', script: '"With solar, instead of paying $X/year to the electric company forever, you\'re paying about $Y/month and owning the asset. After year 7, you\'re basically getting free electricity for the next 18+ years."' },
      { label: 'Close', script: '"Would it make sense to lock in your energy costs now, before rates go up again next quarter?"' },
    ],
    tip: 'Never defend your price. Reframe "expensive" as "compared to what?" The comparison should always be their current electric bill over 25 years.',
  },
  {
    quote: '"Let me think about it."',
    frequency: 'Heard on 65% of calls',
    difficulty: 'medium',
    steps: [
      { label: 'Acknowledge', script: '"Absolutely — this is a big decision and I want you to feel 100% confident. Can I ask what specifically you want to think over?"' },
      { label: 'Isolate the Real Objection', script: '<em>(They\'ll reveal the real concern — price, spouse, timing, etc.)</em> "That makes sense. If we could solve [that specific concern], would you be comfortable moving forward today?"' },
      { label: 'Solve It', script: 'Address whatever they reveal. <em>If it\'s the spouse:</em> "Let\'s get them on a quick call — I can answer their questions in 5 minutes." <em>If it\'s timing:</em> "The federal tax credit drops next year, so locking in now actually saves you $X."' },
      { label: 'Soft Close', script: '"I don\'t want you to miss out on the current incentives. How about we get the paperwork started — there\'s a 3-day cancellation window, so you have zero risk."' },
    ],
    tip: '"Let me think about it" is never the real objection. It means you haven\'t uncovered and resolved the actual concern. Always dig deeper.',
  },
  {
    quote: '"My neighbor got it cheaper."',
    frequency: 'Heard on 45% of calls',
    difficulty: 'medium',
    steps: [
      { label: 'Validate & Get Curious', script: '"Oh that\'s great they went solar! Do you know what brand of panels and inverter they got? And who installed it?"' },
      { label: 'Differentiate on Value', script: '"Not all solar is the same. Cheaper systems often use lower-tier panels that degrade faster — losing 1–2% more production per year. Over 25 years, that\'s tens of thousands in lost energy."' },
      { label: 'Social Proof', script: '"We use [Brand] panels with a 25-year performance warranty. Our last 50 installations are averaging [X]% above projected output. I can show you the monitoring data."' },
      { label: 'Close on Quality', script: '"Would you rather save $2,000 now and lose $15,000 over the system\'s life? Or invest a little more and get maximum return from day one?"' },
    ],
    tip: 'Often the neighbor\'s "cheaper" price was a different system size, different equipment, or they\'re misremembering. Get the specifics before responding.',
  },
  {
    quote: '"I want to get more quotes first."',
    frequency: 'Heard on 55% of calls',
    difficulty: 'medium',
    steps: [
      { label: 'Encourage It', script: '"You absolutely should! I always tell people to get at least 2–3 quotes. Smart move."' },
      { label: 'Set the Benchmark', script: '"When you compare quotes, here\'s what to look for: panel brand and warranty, inverter type, production guarantee, and what happens if they go out of business. Want me to give you a comparison checklist?"' },
      { label: 'Create Urgency', script: '"One thing to keep in mind — we have [X] installation slots left this month, and the current utility rebate expires on [date]. If you get your quotes quickly, we can hold your spot."' },
      { label: 'Stay Top of Mind', script: '"I\'ll text you a comparison checklist right now. When you get other quotes, feel free to send them to me — I\'ll help you compare apples to apples, even if you don\'t go with us."' },
    ],
    tip: 'When you help them compare rather than fight it, you become the trusted advisor. 80% of the time, they come back to you.',
  },
  {
    quote: '"I don\'t trust solar companies."',
    frequency: 'Heard on 38% of calls',
    difficulty: 'hard',
    steps: [
      { label: 'Empathize Deeply', script: '"I don\'t blame you. There have been some really bad actors in this industry — companies that overpromise and underdeliver. You\'re right to be cautious."' },
      { label: 'Show Proof', script: '"Here\'s how we\'re different — [show Google reviews, BBB rating, years in business]. I can also give you the phone numbers of 3 homeowners in your area who we installed for. You can call them directly."' },
      { label: 'Remove Risk', script: '"We include a production guarantee in our contract — if your system doesn\'t produce what we promise, we pay the difference. And you have a 25-year warranty on everything."' },
      { label: 'Close on Trust', script: '"I completely understand the hesitation. Would talking to a couple of our recent customers help you feel more confident?"' },
    ],
    tip: 'This objection is won with proof, not words. Always have references, reviews, and warranties ready to show — don\'t just talk about them.',
  },
  {
    quote: '"I\'m waiting for battery prices to drop."',
    frequency: 'Heard on 30% of calls',
    difficulty: 'medium',
    steps: [
      { label: 'Validate the Thought', script: '"That\'s a smart thing to think about. Battery tech is improving. But let me share something most people don\'t consider..."' },
      { label: 'Reframe the Timeline', script: '"Every month you wait, you\'re paying full price for electricity. Over the next 2 years of waiting, that\'s about $X paid to the utility company that you\'ll never get back."' },
      { label: 'Offer the Bridge', script: '"Here\'s what a lot of our customers do — they install solar now to start saving immediately, and we design the system battery-ready. When prices drop, we add it in an afternoon."' },
      { label: 'Close', script: '"Would you like us to design a battery-ready system so you get the savings now and add storage when the timing is right?"' },
    ],
    tip: 'The "battery-ready" design is a powerful reframe. They get action now + the option for later. Win-win.',
  },
  {
    quote: '"What if I sell my house?"',
    frequency: 'Heard on 42% of calls',
    difficulty: 'easy',
    steps: [
      { label: 'Turn It Into an Advantage', script: '"Great question — this is actually one of the best reasons to go solar. Homes with solar sell for 4.1% more on average, according to Zillow. On a $400K home, that\'s an extra $16,400."' },
      { label: 'Add Data', script: '"Plus, solar homes sell 20% faster because buyers want lower energy bills. Your home becomes more attractive on the market, not less."' },
      { label: 'Handle the Loan Concern', script: '"If you have a solar loan, it transfers to the buyer just like any other home improvement — or you can pay it off at closing from the increased sale price."' },
      { label: 'Close', script: '"So whether you stay 5 years or 25, solar increases your home value. Want to lock in that value now?"' },
    ],
    tip: 'Always have the Zillow stat ready (4.1% home value increase). It\'s the single most powerful data point for this objection.',
  },
  {
    quote: '"The ROI takes too long."',
    frequency: 'Heard on 40% of calls',
    difficulty: 'medium',
    steps: [
      { label: 'Acknowledge & Clarify', script: '"I hear you — how quickly are you hoping to see a return? <em>(listen)</em>"' },
      { label: 'Show Real Numbers', script: '"Most of our customers break even in 5–7 years. After that, it\'s 18+ years of pure profit — that\'s a total ROI of 300–400%. The S&P 500 averages about 10% per year for comparison."' },
      { label: 'Reframe', script: '"Think about it this way — do you question the ROI on your roof, or your windows? Solar is a home improvement that actually pays you back."' },
      { label: 'Close', script: '"Would it help if I showed you a year-by-year savings projection customized to your actual usage?"' },
    ],
    tip: 'Comparing solar ROI to stock market returns is extremely effective. Most investments don\'t return 300–400% over their lifetime.',
  },
  {
    quote: '"My roof is too old."',
    frequency: 'Heard on 25% of calls',
    difficulty: 'easy',
    steps: [
      { label: 'Assess', script: '"How old is your roof, and do you know what material it is? <em>(If less than 10 years old:)</em> Perfect, you\'re well within the window for solar."' },
      { label: 'Offer the Solution', script: '"<em>(If roof needs replacing soon:)</em> Here\'s what a lot of our customers do — they bundle a new roof with the solar install. You save on labor because the crew is already up there, and sometimes the solar loan can cover both."' },
      { label: 'Remove the Barrier', script: '"We do a free structural inspection before any install. If the roof needs work, we\'ll tell you exactly what\'s needed and can coordinate with a roofer to do it all at once."' },
      { label: 'Close', script: '"Want us to come take a look? The inspection is free, and you\'ll know exactly where you stand — no obligation."' },
    ],
    tip: 'A free roof inspection is one of the best lead conversion tools in solar. It gets you on the roof, builds trust, and often the roof is fine.',
  },
  {
    quote: '"I heard solar panels damage your roof."',
    frequency: 'Heard on 28% of calls',
    difficulty: 'easy',
    steps: [
      { label: 'Address Head-On', script: '"That\'s a common myth, so I\'m glad you brought it up. The truth is, when installed properly, solar panels actually protect the section of roof they cover from weather and UV damage."' },
      { label: 'Explain the Process', script: '"We use engineered mounting systems with flashing that seals every penetration point — it\'s actually more waterproof than a bare roof. And we warranty against any roof leaks caused by our installation for 25 years."' },
      { label: 'Social Proof', script: '"We\'ve done [X] installations in this area and have zero roof leak claims. I can show you our reviews and connect you with homeowners who\'ve had panels for 5+ years."' },
      { label: 'Close', script: '"Would it help to see photos of how we do the install? I can show you exactly what the mounting system looks like."' },
    ],
    tip: 'Having installation photos on your phone is extremely powerful. Visual proof beats verbal claims every time.',
  },
  {
    quote: '"I\'ll just wait for the government incentives to get better."',
    frequency: 'Heard on 22% of calls',
    difficulty: 'medium',
    steps: [
      { label: 'Correct the Assumption', script: '"Actually, the incentives are at their best right now. The federal tax credit is currently 30%, but it\'s scheduled to step down. And state/utility rebates are first-come, first-served — once the budget runs out, they\'re gone."' },
      { label: 'Show the Cost of Waiting', script: '"While you wait for maybe-better incentives, you\'re paying full retail for electricity — about $X per month. That\'s $Y per year you\'ll never get back."' },
      { label: 'Create Certainty', script: '"The 30% tax credit is guaranteed today. What the government does next year isn\'t. Would you rather lock in a guaranteed 30% savings, or gamble on something that might not happen?"' },
      { label: 'Close', script: '"Let\'s get you locked in while the full 30% credit is available. I can have your paperwork ready today."' },
    ],
    tip: 'Most customers don\'t realize incentives step down, not up. Print out the ITC schedule to show them the declining percentages.',
  },
  {
    quote: '"My electricity bill isn\'t that high."',
    frequency: 'Heard on 35% of calls',
    difficulty: 'medium',
    steps: [
      { label: 'Validate', script: '"That\'s great — low bills mean you\'re already efficient. But let me ask: even at $100/month, do you know what that adds up to over 25 years?"' },
      { label: 'Do the Math Live', script: '"$100/month x 12 months x 25 years = $30,000. And that\'s assuming rates don\'t go up — which they will. With a 3% annual increase, you\'re looking at over $43,000."' },
      { label: 'Position the Win', script: '"A solar system to offset that would cost you about $X after the tax credit. So you\'re choosing between paying $43K to the utility company or $X for a system you own. Either way you\'re paying for electricity — the question is who profits."' },
      { label: 'Close', script: '"Would you rather keep paying the utility company, or own your power for less?"' },
    ],
    tip: 'The 25-year math always shocks people. Do it live on paper in front of them — never just tell them the number.',
  },
  {
    quote: '"I need to talk to my spouse first."',
    frequency: 'Heard on 58% of calls',
    difficulty: 'hard',
    steps: [
      { label: 'Validate Completely', script: '"Absolutely — this is a household decision and your spouse should be part of it. I\'d be the same way."' },
      { label: 'Get Specific', script: '"What questions do you think they\'ll have? <em>(listen)</em> Those are great questions. Want me to put together a one-page summary with those answers so you can walk them through it?"' },
      { label: 'Offer a Three-Way', script: '"Even better — would it help if we did a quick 10-minute call with them? I can answer their questions directly and save you from having to explain all the technical stuff."' },
      { label: 'Set the Follow-Up', script: '"When do you think you\'ll talk to them? Let me book a time [day after their conversation] to follow up. That way I can answer any questions they come up with."' },
    ],
    tip: 'ALWAYS try to get both decision-makers in the original meeting. If you hear this objection, you missed the qualification step. For next time, ask "Who else is involved in household financial decisions?" before booking the appointment.',
  },
  {
    quote: '"Solar doesn\'t work well in my area / climate."',
    frequency: 'Heard on 20% of calls',
    difficulty: 'easy',
    steps: [
      { label: 'Educate with Data', script: '"I hear that a lot! Actually, [your state] gets enough sun for solar to work great. Fun fact — Germany has less sun than Alaska and they\'re one of the world\'s solar leaders."' },
      { label: 'Show Local Proof', script: '"We\'ve installed [X] systems within 10 miles of your house. Here\'s the actual production data from a home on [nearby street]. They\'re producing [X]% of their electricity from solar."' },
      { label: 'Address the Technology', script: '"Modern panels work on light, not direct sun. They produce energy even on cloudy days — just at a slightly reduced rate. Your system is designed for your specific location and climate."' },
      { label: 'Close', script: '"Would you like to see the projected production for your specific roof? We use satellite data and local weather patterns to calculate it within 5% accuracy."' },
    ],
    tip: 'Always have a local installation reference ready. Nothing beats "your neighbor 3 streets over generates X kWh per month."',
  },
];

const salesFlow: FlowStep[] = [
  {
    phase: 'Phase 1',
    title: 'The Warm Opening (First 2 minutes)',
    time: '0:00-2:00',
    sayBlocks: [
      { type: 'say', content: '"Hey [Name], thanks for taking the time today! Before we dive in, I just want to understand your situation — this isn\'t a pitch, it\'s a conversation to see if solar even makes sense for you. Sound good?"' },
      { type: 'do', content: 'Smile. Use their name. Set the frame that YOU are evaluating THEM (not the other way around). This flips the power dynamic.' },
      { type: 'text', content: 'Build rapport: Comment on their home, neighborhood, or something specific. "Beautiful property, by the way — how long have you been here?"' },
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Situation Questions (Pain Discovery)',
    time: '2:00-8:00',
    sayBlocks: [
      { type: 'say', content: '"What made you reach out about solar? Was there a specific trigger?"' },
      { type: 'text', content: 'Let them talk. The more they talk, the more they sell themselves.' },
      { type: 'say', content: '"How much is your average electric bill? ... And is that going up, down, or staying flat?"' },
      { type: 'say', content: '"Have you looked into solar before, or is this your first time exploring it?"' },
      { type: 'say', content: '"On a scale of 1-10, how motivated are you to go solar? ... What would make it a 10?"' },
      { type: 'do', content: 'Write down their answers. You\'ll use their exact words later in the close. "You told me your main motivation was [X] — this system delivers exactly that."' },
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Pain Amplification',
    time: '8:00-12:00',
    sayBlocks: [
      { type: 'say', content: '"So if you\'re paying $200/month now, and rates go up 3-5% per year... do you know what that looks like over 25 years? (pause) That\'s over $85,000 going to the electric company."' },
      { type: 'say', content: '"And the hardest part is — you never own anything. You pay $85K and have zero to show for it."' },
      { type: 'do', content: 'Use a calculator or pen and paper. Show them the math live — never just tell them. People believe what they see, not what they hear.' },
      { type: 'text', content: 'Then ask: "Does that concern you?" (Let them feel the weight of the number.)' },
    ],
  },
  {
    phase: 'Phase 4',
    title: 'The Solution Presentation',
    time: '12:00-20:00',
    sayBlocks: [
      { type: 'do', content: 'TRANSITION: "Based on everything you\'ve shared, let me show you what a system designed specifically for your home looks like."' },
      { type: 'say', content: '"Here\'s your custom system: [X] panels, [Brand], producing [Y] kWh per year. That offsets [Z]% of your bill."' },
      { type: 'say', content: '"Your investment is $[Total]. After the 30% federal tax credit, your net cost is $[Net]. At $[Monthly] per month, you\'re actually paying less than your current electric bill — but now you own the power."' },
      { type: 'do', content: 'KEY PHRASE: "You\'re already paying for electricity — the only question is whether you want to own it or rent it."' },
      { type: 'text', content: 'Show the payback timeline: "You break even in year [X]. From year [X+1] to year 25, that\'s [Y] years of free electricity."' },
    ],
  },
  {
    phase: 'Phase 5',
    title: 'Trial Close',
    time: '20:00-22:00',
    sayBlocks: [
      { type: 'say', content: '"Based on what you\'re seeing here — the savings, the tax credit, the protection from rate increases — does this feel like something that makes sense for your family?"' },
      { type: 'do', content: 'IMPORTANT: Ask this BEFORE talking about next steps. If they say yes (or anything positive), proceed to close. If they hesitate, you have an objection to handle.' },
      { type: 'text', content: 'If positive: Move to Phase 6. If hesitant: "What\'s holding you back? I\'d rather you tell me honestly than walk away with unanswered questions."' },
    ],
  },
  {
    phase: 'Phase 6',
    title: 'The Close',
    time: '22:00-25:00',
    sayBlocks: [
      { type: 'say', content: '"Great — here\'s what happens next. I\'ll send you the agreement right now. You review it, e-sign it, and we schedule your installation. The whole process takes about [X] weeks."' },
      { type: 'say', content: '"And remember — you have a [3-day/cancellation period] to change your mind for any reason. So there\'s truly zero risk in moving forward today and locking in these incentives."' },
      { type: 'do', content: 'Use assumptive language. Don\'t say "Would you like to...?" Say "Here\'s what happens next." Guide them — don\'t ask for permission.' },
      { type: 'do', content: 'ALWAYS mention: The cancellation period. It removes fear and makes signing feel safe.' },
    ],
  },
];

const closingTechniques: ClosingTechnique[] = [
  {
    icon: '\u23F0',
    colorClass: 'text-amber-500',
    bgClass: 'bg-amber-500/10',
    name: 'The Urgency Close',
    when: 'When they like it but want to wait',
    dialogue: [
      { speaker: 'you', text: '"I want to be transparent — we have 4 installation slots left this month. After that, our next opening is in 6 weeks. And the utility rebate is first-come, first-served."' },
      { speaker: 'you', text: '"I\'d hate for you to lose out on $2,400 in rebates because of a scheduling gap. Can we lock in your slot today?"' },
    ],
  },
  {
    icon: '\uD83D\uDD04',
    colorClass: 'text-blue-500',
    bgClass: 'bg-blue-500/10',
    name: 'The Takeaway Close',
    when: 'When they\'re on the fence and need a nudge',
    dialogue: [
      { speaker: 'you', text: '"You know what — maybe solar isn\'t right for everyone. If the savings don\'t make sense for your situation, I totally understand. Not every home qualifies."' },
      { speaker: 'them', text: '"Wait — are you saying we might not qualify?"' },
      { speaker: 'you', text: '"No, you absolutely qualify — your home is actually ideal. I just don\'t want you to feel pressured. The question is whether you want to act on it now or wait and pay higher rates."' },
    ],
  },
  {
    icon: '\uD83D\uDCD0',
    colorClass: 'text-emerald-500',
    bgClass: 'bg-emerald-500/10',
    name: 'The Comparison Close',
    when: 'When they\'re debating options or competitors',
    dialogue: [
      { speaker: 'you', text: '"Let\'s put the two options side by side. Option A: Do nothing. You pay $200/month — $85K over 25 years — to the utility company. You own nothing."' },
      { speaker: 'you', text: '"Option B: Go solar. You pay $150/month, own the system, and after year 7 you\'re getting free electricity for 18 years. Which makes more financial sense?"' },
    ],
  },
  {
    icon: '\uD83E\uDD1D',
    colorClass: 'text-purple-500',
    bgClass: 'bg-purple-500/10',
    name: 'The Referral Close',
    when: 'When they need social proof to decide',
    dialogue: [
      { speaker: 'you', text: '"Tell you what — let me give you the number of Mr. Johnson on Oak Street. He was in your exact position 8 months ago. Same concerns, same questions. He can tell you exactly how his experience has been."' },
      { speaker: 'you', text: '"And if after talking to him you feel confident, I\'ll hold your installation slot until end of this week. Fair?"' },
    ],
  },
  {
    icon: '\uD83C\uDF81',
    colorClass: 'text-cyan-500',
    bgClass: 'bg-cyan-500/10',
    name: 'The Bonus Close',
    when: 'When they need one more reason to say yes today',
    dialogue: [
      { speaker: 'you', text: '"Since you\'re one of the first 10 installs in this neighborhood, I can offer you our smart monitoring system at no additional charge — that\'s a $500 value. But I can only hold that for same-day commitments."' },
      { speaker: 'you', text: '"Would that make it easy to say yes today?"' },
    ],
  },
  {
    icon: '\uD83D\uDCDD',
    colorClass: 'text-amber-500',
    bgClass: 'bg-amber-500/10',
    name: 'The Assumptive Close',
    when: 'When they\'ve shown buying signals throughout',
    dialogue: [
      { speaker: 'you', text: '"Perfect. So for the installation, do you prefer morning or afternoon appointments? And which email should I send the agreement to?"' },
      { speaker: 'them', text: '"Uh, mornings are better. And use my personal email..."' },
      { speaker: 'you', text: '"Great. I\'ll get the paperwork over to you right now. You\'ll have it in your inbox in about 2 minutes."' },
    ],
  },
  {
    icon: '\uD83D\uDEE1\uFE0F',
    colorClass: 'text-emerald-500',
    bgClass: 'bg-emerald-500/10',
    name: 'The Risk Reversal Close',
    when: 'When fear is the main blocker',
    dialogue: [
      { speaker: 'you', text: '"I understand the hesitation. Here\'s what I\'d suggest: sign the agreement today to lock in your pricing and installation date. You have a full 3-day cancellation window — you can cancel for any reason, no questions asked."' },
      { speaker: 'you', text: '"This way, you don\'t lose your spot or the current incentives, and you have 3 days to sleep on it with zero risk. Worst case, you cancel. Best case, you start saving. Sound fair?"' },
    ],
  },
];

const practiceScenarios: PracticeScenario[] = [
  {
    quote: '"We just can\'t afford it right now."',
    context: 'Homeowner on a fixed income',
    answer: 'Reframe from "afford" to "save". "I understand budgets are tight — that\'s exactly why solar makes sense. You\'re not adding a new expense, you\'re replacing your electric bill with a lower payment. Instead of $200/month to the utility, you\'d pay $140/month and own the system. Can I show you the exact numbers for your home?"',
  },
  {
    quote: '"My HOA won\'t allow it."',
    context: 'Suburban neighborhood with strict HOA',
    answer: 'Know your state laws. "Great news — in most states, HOAs legally cannot prohibit solar panel installation. It\'s called a Solar Access Law. I\'ve dealt with many HOAs and can help you navigate the approval process. Would you like me to review your HOA guidelines with you?"',
  },
  {
    quote: '"What happens during a power outage?"',
    context: 'After a recent storm in the area',
    answer: 'Be honest, then upsell. "With a standard grid-tied system, your panels shut off during an outage for safety reasons. But if backup power is important to you, we can add a battery system that keeps your essential circuits running — fridge, lights, and outlets — even during outages. Would you like me to include a battery option in your quote?"',
  },
  {
    quote: '"I read that solar panels are bad for the environment to manufacture."',
    context: 'Environmentally conscious buyer',
    answer: 'Use the energy payback stat. "That\'s a great question. Solar panels produce 20-25x more energy over their lifetime than it takes to manufacture them. The \'energy payback\' period is only 1-3 years — meaning for the remaining 22+ years, it\'s pure clean energy. And at end of life, the materials are recyclable. Would you like to see the environmental impact report for your specific system?"',
  },
  {
    quote: '"I\'m going to sell in 2 years, not worth it."',
    context: 'Homeowner planning to relocate',
    answer: 'Flip it to a home value play. "Actually, 2 years is the perfect timeline. Homes with solar sell for 4.1% more and 20% faster — on a $400K home, that\'s $16,400 in added value. You get 2 years of energy savings PLUS a higher sale price. The system essentially pays for itself at closing. Would that change how you see it?"',
  },
  {
    quote: '"What about hail damage?"',
    context: 'Area with frequent severe weather',
    answer: 'Address with facts and warranty. "Solar panels are engineered to withstand 1-inch hail at 50mph — they\'re basically bulletproof glass. Plus, your homeowner\'s insurance covers solar panels, and our installation comes with a 25-year warranty covering any defects. In 10+ years of installations, we\'ve had zero hail damage claims. Want to see the testing videos?"',
  },
  {
    quote: '"I don\'t want my house to look ugly."',
    context: 'Design-conscious homeowner',
    answer: 'Show modern aesthetics. "I totally get it — curb appeal matters. Let me show you what modern installations look like. We use all-black panels with black frames and hidden wiring — they look sleek and premium. Many of our customers actually think they make the house look more modern. Want to see photos of homes in your neighborhood with solar?"',
  },
  {
    quote: '"What if the company goes out of business?"',
    context: 'Skeptical buyer',
    answer: 'Address with manufacturer warranty. "That\'s a smart question. Here\'s the thing — your warranty is backed by the panel manufacturer, not just our company. [Brand] is a $X billion company with a 25-year warranty regardless of who installed it. Your inverter has its own separate warranty too. And your system will keep producing power no matter what — it\'s not dependent on any company to function."',
  },
];

type TabId = 'objections' | 'flow' | 'closes' | 'practice';

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'objections', label: 'Objection Killer', icon: '\uD83D\uDEE1\uFE0F' },
  { id: 'flow', label: 'Sales Flow', icon: '\uD83D\uDCCB' },
  { id: 'closes', label: 'Closing Moves', icon: '\uD83C\uDFAF' },
  { id: 'practice', label: 'Practice Mode', icon: '\uD83C\uDFCB\uFE0F' },
];

const difficultyStyles: Record<string, string> = {
  easy: 'bg-emerald-500/10 text-emerald-500',
  medium: 'bg-amber-500/10 text-amber-500',
  hard: 'bg-red-500/10 text-red-500',
};

const SolarSalesCloser: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('objections');
  const [expandedObjection, setExpandedObjection] = useState<number | null>(null);
  const [openFlowSteps, setOpenFlowSteps] = useState<Set<number>>(new Set());
  const [openTechniques, setOpenTechniques] = useState<Set<number>>(new Set());
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [practiced, setPracticed] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [answerRevealed, setAnswerRevealed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Solar Sales Closer Toolkit | Boltcall';
    updateMetaDescription(
      'Free Solar Sales Closer Toolkit — 14 objection-killing scripts, 6-step sales flow, 7 closing techniques, and practice mode. Turn "let me think about it" into signed contracts.'
    );

    // Service schema
    const serviceSchema = document.createElement('script');
    serviceSchema.type = 'application/ld+json';
    serviceSchema.id = 'schema-service-solar-sales-closer';
    serviceSchema.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Solar Sales Closer AI Tool',
      'description': 'AI-powered sales closing tool for solar businesses — handles objections, follows up with leads, and books consultations automatically.',
      'provider': {
        '@type': 'Organization',
        'name': 'Boltcall',
        'url': 'https://boltcall.org',
      },
      'areaServed': 'US',
      'serviceType': 'AI Sales Assistant',
    });
    document.head.appendChild(serviceSchema);

    // BreadcrumbList schema
    const breadcrumbSchema = document.createElement('script');
    breadcrumbSchema.type = 'application/ld+json';
    breadcrumbSchema.id = 'schema-breadcrumb-solar-sales-closer';
    breadcrumbSchema.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://boltcall.org' },
        { '@type': 'ListItem', 'position': 2, 'name': 'Tools', 'item': 'https://boltcall.org/tools' },
        { '@type': 'ListItem', 'position': 3, 'name': 'Solar Sales Closer', 'item': 'https://boltcall.org/tools/solar-sales-closer' },
      ],
    });
    document.head.appendChild(breadcrumbSchema);

    return () => {
      document.getElementById('schema-service-solar-sales-closer')?.remove();
      document.getElementById('schema-breadcrumb-solar-sales-closer')?.remove();
    };
  }, []);

  const toggleObjection = (index: number) => {
    setExpandedObjection(expandedObjection === index ? null : index);
  };

  const toggleFlowStep = (index: number) => {
    setOpenFlowSteps((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const toggleTechnique = (index: number) => {
    setOpenTechniques((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const revealAnswer = () => {
    if (!answerRevealed) {
      setAnswerRevealed(true);
      setPracticed((p) => p + 1);
      setTotalAttempts((t) => t + 1);
    }
  };

  const nextScenario = () => {
    if (!answerRevealed) {
      setTotalAttempts((t) => t + 1);
    }
    setAnswerRevealed(false);
    setPracticeIndex((i) => (i + 1) % practiceScenarios.length);
  };

  const currentScenario = practiceScenarios[practiceIndex];

  return (
    <div className="min-h-screen bg-white">
      <GiveawayBar />
      <Header />
      <main className="pt-20 bg-[#0B0F1A] text-slate-100 font-['Inter',sans-serif]">
        {/* Hero */}
        <section
          className="text-center px-6 pt-12 pb-9 relative"
          style={{
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(245,158,11,0.06) 0%, transparent 60%)',
          }}
        >
          <div className="text-5xl mb-4 drop-shadow-[0_0_20px_rgba(245,158,11,0.3)]">
            &#9889;
          </div>
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 rounded-full px-3.5 py-1 text-xs font-semibold text-amber-500 mb-4">
            &#127919; Free Sales Toolkit for Solar Pros
          </div>
          <h1 className="text-[clamp(1.8rem,4.5vw,2.8rem)] font-black tracking-tight leading-[1.1] mb-2.5">
            Solar Sales{' '}
            <span className="bg-gradient-to-br from-amber-500 to-red-500 bg-clip-text text-transparent">
              Closer Toolkit
            </span>
          </h1>
          <p className="text-slate-400 text-lg max-w-[500px] mx-auto">
            Word-for-word scripts, objection destroyers, and closing techniques that turn
            &ldquo;let me think about it&rdquo; into signed contracts.
          </p>
        </section>

        {/* Stats Bar */}
        <div className="flex justify-center gap-8 px-6 py-5 flex-wrap">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-extrabold text-lg text-amber-500">14</span>
            <span className="text-slate-500">Objection Scripts</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-extrabold text-lg text-emerald-500">7</span>
            <span className="text-slate-500">Closing Techniques</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-extrabold text-lg text-blue-500">6</span>
            <span className="text-slate-500">Sales Flow Steps</span>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="flex justify-center gap-6 px-6 pb-6 flex-wrap">
          {[
            'No credit card required',
            'Live in 24 hours',
            'Cancel anytime',
          ].map((signal) => (
            <div key={signal} className="flex items-center gap-1.5 text-sm text-slate-400">
              <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {signal}
            </div>
          ))}
        </div>

        {/* App Container */}
        <div className="max-w-[960px] mx-auto px-6 pb-20">
          {/* Tab Bar */}
          <div className="flex gap-1 bg-[#141928] rounded-[14px] p-1 mb-7 border border-[#2A3352] overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-4 border-none text-sm font-semibold rounded-[10px] cursor-pointer transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-black shadow-[0_4px_16px_rgba(245,158,11,0.25)]'
                    : 'bg-transparent text-slate-500 hover:text-slate-400 hover:bg-[#1A2035]'
                }`}
              >
                <span>{tab.icon}</span> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab 1: Objections */}
          {activeTab === 'objections' && (
            <div className="animate-[fadeUp_0.35s_ease]">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
                {objections.map((obj, i) => {
                  const isExpanded = expandedObjection === i;
                  return (
                    <div
                      key={i}
                      onClick={() => toggleObjection(i)}
                      className={`bg-[#141928] border rounded-[14px] p-5 cursor-pointer transition-all duration-200 relative overflow-hidden ${
                        isExpanded
                          ? 'col-span-full border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.08)]'
                          : 'border-[#2A3352] hover:border-amber-500 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]'
                      }`}
                    >
                      <div
                        className={`inline-flex items-center gap-1 text-[0.7rem] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md mb-2.5 ${difficultyStyles[obj.difficulty]}`}
                      >
                        {obj.difficulty}
                      </div>
                      <div className="text-base font-bold leading-snug mb-1.5">{obj.quote}</div>
                      <div className="text-xs text-slate-500">{obj.frequency}</div>

                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-[#2A3352]">
                          {obj.steps.map((step, j) => (
                            <div
                              key={j}
                              className="mb-4 p-3.5 bg-[#1A2035] rounded-[10px] border-l-[3px] border-l-amber-500"
                            >
                              <div className="text-[0.7rem] font-bold text-amber-500 uppercase tracking-widest mb-1">
                                Step {j + 1}
                              </div>
                              <div className="text-sm font-bold mb-1.5">{step.label}</div>
                              <div
                                className="text-sm leading-relaxed text-slate-400 [&_em]:text-amber-500 [&_em]:italic"
                                dangerouslySetInnerHTML={{ __html: step.script }}
                              />
                            </div>
                          ))}
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-[10px] p-3 mt-3 text-sm text-slate-400">
                            <strong className="text-blue-500">&#128161; Pro Tip:</strong>{' '}
                            {obj.tip}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Sales Flow */}
          {activeTab === 'flow' && (
            <div className="animate-[fadeUp_0.35s_ease]">
              <div className="relative pl-9 before:content-[''] before:absolute before:left-[15px] before:top-0 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:to-emerald-500 before:rounded-full">
                {salesFlow.map((step, i) => {
                  const isOpen = openFlowSteps.has(i);
                  return (
                    <div
                      key={i}
                      onClick={() => toggleFlowStep(i)}
                      className="relative mb-6 bg-[#141928] border border-[#2A3352] rounded-[14px] p-5 cursor-pointer transition-all duration-200 hover:border-amber-500/30 hover:shadow-[0_4px_20px_rgba(0,0,0,0.2)] before:content-[''] before:absolute before:-left-7 before:top-6 before:w-3 before:h-3 before:rounded-full before:bg-amber-500 before:border-[3px] before:border-[#0B0F1A] before:z-[1]"
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <div className="text-[0.7rem] font-bold text-amber-500 uppercase tracking-widest">
                          {step.phase}
                        </div>
                        <div className="text-xs text-slate-500 bg-[#1A2035] px-2 py-0.5 rounded-md">
                          {step.time}
                        </div>
                      </div>
                      <h3 className="text-base font-bold mb-2">{step.title}</h3>
                      {!isOpen && (
                        <div className="text-xs text-slate-500">
                          Click to expand full script &rarr;
                        </div>
                      )}
                      {isOpen && (
                        <div className="text-sm leading-[1.7] text-slate-400 mt-2">
                          {step.sayBlocks.map((block, j) => {
                            if (block.type === 'say') {
                              return (
                                <div
                                  key={j}
                                  className="bg-amber-500/10 border-l-[3px] border-l-amber-500 px-3.5 py-2.5 rounded-r-lg my-2.5 italic"
                                >
                                  {block.content}
                                </div>
                              );
                            }
                            if (block.type === 'do') {
                              return (
                                <div
                                  key={j}
                                  className="bg-blue-500/10 border-l-[3px] border-l-blue-500 px-3.5 py-2.5 rounded-r-lg my-2.5 text-sm"
                                >
                                  <strong>{block.content}</strong>
                                </div>
                              );
                            }
                            return (
                              <p key={j} className="mt-3 italic text-slate-400">
                                {block.content}
                              </p>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 3: Closing Techniques */}
          {activeTab === 'closes' && (
            <div className="animate-[fadeUp_0.35s_ease]">
              {closingTechniques.map((tech, i) => {
                const isOpen = openTechniques.has(i);
                return (
                  <div
                    key={i}
                    onClick={() => toggleTechnique(i)}
                    className="bg-[#141928] border border-[#2A3352] rounded-[14px] p-[22px] mb-4 transition-all duration-200 cursor-pointer hover:border-amber-500/30"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-[42px] h-[42px] rounded-[10px] flex items-center justify-center text-xl shrink-0 ${tech.bgClass}`}
                      >
                        {tech.icon}
                      </div>
                      <div>
                        <h3 className="text-base font-bold">{tech.name}</h3>
                        <div className="text-xs text-slate-500">When to use: {tech.when}</div>
                      </div>
                    </div>
                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-[#2A3352]">
                        <div className="bg-[#1A2035] rounded-[10px] p-3.5">
                          {tech.dialogue.map((d, j) => (
                            <div key={j} className="mb-2.5 last:mb-0 text-sm leading-normal">
                              <div
                                className={`font-bold text-xs uppercase tracking-wider mb-0.5 ${
                                  d.speaker === 'you' ? 'text-emerald-500' : 'text-slate-500'
                                }`}
                              >
                                {d.speaker === 'you'
                                  ? '\uD83D\uDFE2 YOU'
                                  : '\u26AA THEM'}
                              </div>
                              <div className="text-slate-400">{d.text}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 4: Practice Mode */}
          {activeTab === 'practice' && (
            <div className="animate-[fadeUp_0.35s_ease]">
              <div className="bg-[#141928] border border-[#2A3352] rounded-[14px] p-6 text-center">
                <h3 className="text-xl font-bold">
                  &#127947;&#65039; Objection Practice Mode
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Random scenarios to sharpen your reflexes. Think of your response, then reveal
                  the pro answer.
                </p>

                <div className="flex gap-4 justify-center mt-5">
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-emerald-500">{practiced}</div>
                    <div className="text-xs text-slate-500">Practiced</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-extrabold text-slate-400">{totalAttempts}</div>
                    <div className="text-xs text-slate-500">Total</div>
                  </div>
                </div>

                <div className="bg-[#1A2035] rounded-xl p-6 my-5 min-h-[120px] flex flex-col items-center justify-center">
                  <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">
                    THE CUSTOMER SAYS:
                  </div>
                  <div className="text-xl font-extrabold leading-snug max-w-[500px]">
                    {currentScenario.quote}
                  </div>
                  <div className="text-sm text-slate-500 mt-2">{currentScenario.context}</div>
                </div>

                <div className="flex gap-2.5 justify-center flex-wrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      revealAnswer();
                    }}
                    className="py-2.5 px-5 rounded-[10px] bg-amber-500 text-black font-semibold text-sm cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(245,158,11,0.3)]"
                  >
                    &#128161; Reveal Best Response
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextScenario();
                    }}
                    className="py-2.5 px-5 rounded-[10px] border border-[#2A3352] bg-[#1A2035] text-slate-100 font-semibold text-sm cursor-pointer transition-all duration-200 hover:border-amber-500 hover:bg-amber-500/10"
                  >
                    &#9193;&#65039; Next Scenario
                  </button>
                </div>

                {answerRevealed && (
                  <div className="text-left bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-[18px] mt-4">
                    <h4 className="text-emerald-500 text-xs uppercase tracking-wider font-bold mb-2">
                      &#9989; Best Response
                    </h4>
                    <p className="text-[0.95rem] leading-relaxed text-slate-400">
                      {currentScenario.answer}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Social Proof */}
          <section id="social-proof" className="mt-12">
            <h3 className="text-center text-lg font-extrabold mb-6 text-slate-100">
              What Solar Pros Are Saying
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  quote: 'We went from closing 1 in 10 leads to 1 in 4. The AI handles objections better than our human closers did on the phone.',
                  name: 'Mike T.',
                  company: 'Solar Solutions AZ',
                },
                {
                  quote: 'After-hours leads used to die in voicemail. Now the AI follows up instantly and books consultations while we sleep.',
                  name: 'Jennifer R.',
                  company: 'SunPower Installations TX',
                },
                {
                  quote: 'Set it up on a Tuesday, had 3 new consultations booked by Friday. Worth every penny.',
                  name: 'Carlos M.',
                  company: 'Green Energy Partners FL',
                },
              ].map((t) => (
                <div
                  key={t.name}
                  className="bg-[#141928] border border-[#2A3352] rounded-[14px] p-5 flex flex-col gap-3"
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed flex-1">"{t.quote}"</p>
                  <div>
                    <div className="text-sm font-bold text-slate-100">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.company}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <div className="text-center mt-12 py-10 px-6 bg-gradient-to-br from-amber-500/5 to-red-500/5 border border-[#2A3352] rounded-2xl">
            <h3 className="text-xl font-extrabold mb-2">
              Want a Sales System That Closes 40%+ of Consultations?
            </h3>
            <p className="text-slate-400 mb-5">
              We train solar teams to close more deals without discounting. Book a free strategy
              session.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-amber-500 to-amber-600 text-black font-bold text-base py-3.5 px-8 rounded-xl border-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(245,158,11,0.3)] no-underline"
            >
              Book Free Training Call &rarr;
            </Link>
          </div>
        </div>

        {/* Branding */}
        <div className="text-center py-6 text-slate-500 text-sm">
          Built with &#9889; by{' '}
          <Link to="/" className="text-amber-500 no-underline font-semibold hover:underline">
            Boltcall
          </Link>{' '}
          — The Growth Partner for Solar Pros
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SolarSalesCloser;
