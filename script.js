'use strict';

/* =============================================
   ComplaintCraft — script.js
   No frameworks. No backend. Pure JS.
   ============================================= */


// ─────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 'food',
    icon: '🍔',
    name: 'Food & Grocery',
    apps: 'Swiggy · Zomato · Blinkit · Zepto · Dunzo',
    problems: [
      { id: 'missing_item', label: 'Item(s) missing' },
      { id: 'wrong_item',   label: 'Wrong item delivered' },
      { id: 'delayed',      label: 'Order very delayed' },
      { id: 'quality',      label: 'Poor food quality' },
      { id: 'cancelled',    label: 'Order cancelled' },
    ]
  },
  {
    id: 'shopping',
    icon: '🛍️',
    name: 'Shopping',
    apps: 'Amazon · Flipkart · Myntra · Meesho · Nykaa',
    problems: [
      { id: 'not_delivered',   label: 'Item not delivered' },
      { id: 'wrong_item',      label: 'Wrong item received' },
      { id: 'damaged',         label: 'Damaged product' },
      { id: 'size_issue',      label: 'Wrong size / doesn\'t fit' },
      { id: 'not_as_shown',    label: 'Not as shown / described' },
      { id: 'fake_product',    label: 'Fake / counterfeit product' },
      { id: 'missing_parts',   label: 'Missing parts / accessories' },
      { id: 'refund',          label: 'Refund not received' },
      { id: 'return_issue',    label: 'Return rejected' },
    ]
  },
  {
    id: 'rides',
    icon: '🚗',
    name: 'Rides',
    apps: 'Uber · Ola · Rapido · Namma Yatri',
    problems: [
      { id: 'driver_cancelled', label: 'Driver cancelled' },
      { id: 'overcharged',      label: 'Wrong fare charged' },
      { id: 'no_show',          label: 'Driver never arrived' },
      { id: 'lost_item',        label: 'Lost item in vehicle' },
      { id: 'rude_driver',      label: 'Rude/unsafe driver' },
    ]
  }
];

const TONES = [
  { id: 'polite',  emoji: '😊', name: 'Polite',  tag: 'Most Effective ⭐', desc: 'Gets fastest resolution' },
  { id: 'neutral', emoji: '😐', name: 'Neutral', tag: 'Balanced',          desc: 'Clear and professional'  },
  { id: 'firm',    emoji: '😤', name: 'Firm',    tag: 'Assertive',         desc: 'For repeat issues'       },
  { id: 'angry',   emoji: '😡', name: 'Angry',   tag: 'Forceful',          desc: 'Last resort'             },
];


// ─────────────────────────────────────────────
// MESSAGE TEMPLATES
// Returns { polite, neutral, firm, angry }
// Category name (e.g. "Swiggy / Zomato / Blinkit") is passed generically
// ─────────────────────────────────────────────

const MESSAGES = {

  food: {
    missing_item: () => ({
      polite:
`Hi Support Team 😊

I placed an order that just arrived, but one or more items seem to be missing. I understand mistakes happen — could you please help me with a refund or replacement for the missing item(s)?

Order ID: [Add your Order ID]
Missing item(s): [Mention item name]

Thank you so much! 🙏`,

      neutral:
`Hello Support,

I'm writing to report that item(s) were missing from my recent delivery.

Order ID: [Add your Order ID]
Missing item(s): [Mention item name]

Please process a refund or re-delivery for the missing item(s) and confirm once done.`,

      firm:
`To Customer Support,

Items I paid for were NOT delivered. This is unacceptable and I require an immediate resolution:

• Full refund for the missing item(s), OR
• Re-delivery of the missing item(s)

Order ID: [Add your Order ID]
Missing item(s): [Mention item name]

I expect this resolved within 24 hours.`,

      angry:
`Support,

This is completely unacceptable! I paid for items that were NEVER delivered. I want an IMMEDIATE refund — no delays.

Order ID: [Add your Order ID]
Missing item(s): [Mention item name]

If not resolved right now, I will file a consumer forum complaint and leave detailed reviews on every platform.`
    }),

    wrong_item: () => ({
      polite:
`Hi Support Team 😊

I received my order but it looks like the wrong item was delivered — it doesn't match what I ordered at all. Could you help me with a replacement or refund? I'm happy to share photos!

Order ID: [Add your Order ID]
What I ordered: [Item name]
What I received: [Item name]

Thank you! 🙏`,

      neutral:
`Hello Support,

My recent order contained the wrong item. What was delivered does not match what I ordered.

Order ID: [Add your Order ID]

Please arrange a replacement with the correct item or issue a full refund.`,

      firm:
`To Customer Support,

I received the WRONG ITEM — this is a fulfillment error. I require immediate correction:

• Deliver the correct item, OR
• Issue a full refund

Order ID: [Add your Order ID]
Ordered: [Item] | Received: [Item]

I have photos. Resolve within 24 hours.`,

      angry:
`Support,

I ordered one item and received something completely DIFFERENT. Does anyone check orders before delivery?

I want my correct item OR a FULL REFUND right now.

Order ID: [Add your Order ID]

If this isn't fixed immediately, I will dispute the charge with my bank and file a consumer complaint!`
    }),

    delayed: () => ({
      polite:
`Hi Support Team 😊

My order is running significantly beyond the estimated delivery time. Could you check what's happening and give me an update? If delivery isn't possible soon, I'd appreciate a full refund.

Order ID: [Add your Order ID]

Thanks for your help! 🙏`,

      neutral:
`Hello Support,

My order is delayed well past the estimated delivery time with no update in the app.

Order ID: [Add your Order ID]

Please check the status immediately. If it cannot arrive within 15 minutes, cancel and issue a full refund.`,

      firm:
`To Customer Support,

My order is unacceptably late with zero communication from your end.

Order ID: [Add your Order ID]

If the order cannot be delivered in the next 15 minutes, I expect an immediate cancellation and FULL refund. I require prompt action.`,

      angry:
`Support,

My order is EXTREMELY late with NO communication! What am I paying delivery fees for?!

Order ID: [Add your Order ID]

Deliver in the NEXT 15 MINUTES or cancel and refund me RIGHT NOW. I will report this publicly if not resolved immediately.`
    }),

    quality: () => ({
      polite:
`Hi Support Team 😊

I usually love ordering with you, but my recent order had a food quality issue — the food arrived cold/stale/in poor condition. I'd really appreciate a replacement or partial refund!

Order ID: [Add your Order ID]
Affected item(s): [Mention item name]

Thank you for understanding! 🙏`,

      neutral:
`Hello Support,

I'm reporting a food quality issue with my recent order. The food was not in acceptable condition upon delivery.

Order ID: [Add your Order ID]

Please process a refund or replacement for the affected item(s).`,

      firm:
`To Customer Support,

The food I received was in an unacceptable condition — this does not meet any reasonable quality standard. Food safety is not negotiable.

Order ID: [Add your Order ID]
Affected item(s): [Mention item name]

I require an immediate refund and ask that you investigate the restaurant to prevent this recurring.`,

      angry:
`Support,

The food I received was COMPLETELY INEDIBLE! This is a health and safety issue.

Order ID: [Add your Order ID]

I want a FULL REFUND. No partial credit, no vouchers — real money back. If not refunded immediately, I will report this as a food safety violation and share my experience everywhere.`
    }),

    cancelled: () => ({
      polite:
`Hi Support Team 😊

My order was cancelled and I didn't cancel it myself! Could you help me understand what happened and either reinstate the order or process a full refund?

Order ID: [Add your Order ID]

Thank you! 🙏`,

      neutral:
`Hello Support,

My order was cancelled without my action or consent.

Order ID: [Add your Order ID]

Please either reinstate the order and deliver it, or issue a full refund immediately.`,

      firm:
`To Customer Support,

My order was cancelled without my permission or any explanation. I have been charged for an order I never received.

Order ID: [Add your Order ID]

I demand a full refund immediately. If not processed within 24 hours, I will escalate this further.`,

      angry:
`Support,

My order was CANCELLED without my permission! I paid for this — you cannot just cancel orders and keep the money.

Order ID: [Add your Order ID]

I want a FULL REFUND processed RIGHT NOW. If not resolved immediately, I will take legal action.`
    }),
  },


  shopping: {
    not_delivered: () => ({
      polite:
`Hi Support Team 😊

My order is showing as "Delivered" but I haven't received it. I've checked everywhere at my address — it simply isn't here. Could you please investigate and help me get my item or a refund?

Order ID: [Add your Order ID]

Thank you so much! 🙏`,

      neutral:
`Hello Support,

My order is marked as delivered in your system, but I have not received the package.

Order ID: [Add your Order ID]

Please investigate immediately and either arrange re-delivery or process a full refund.`,

      firm:
`To Customer Support,

My order shows "Delivered" — it was NOT delivered. The package is missing.

Order ID: [Add your Order ID]

I require an immediate investigation and one of the following within 48 hours:
• Re-delivery of my order, OR
• Full refund`,

      angry:
`Support,

MY ORDER WAS NEVER DELIVERED! Your system says delivered — it absolutely was NOT. Someone must take responsibility!

Order ID: [Add your Order ID]

I want my product delivered TODAY or a FULL REFUND immediately. If not resolved, I will dispute with my bank, file a consumer court complaint, and share this publicly.`
    }),

    wrong_item: () => ({
      polite:
`Hi Support Team 😊

I received my package but the wrong item was sent — it doesn't match my order at all. I'd appreciate help with returning it and getting the correct item or a refund!

Order ID: [Add your Order ID]

Photos available if needed. Thanks! 🙏`,

      neutral:
`Hello Support,

The wrong item was delivered for my recent order. The product received does not match what I ordered.

Order ID: [Add your Order ID]

Please arrange a return pickup and deliver the correct item, or issue a full refund.`,

      firm:
`To Customer Support,

I received the WRONG ITEM. This is a fulfillment error and must be corrected at no cost to me.

Order ID: [Add your Order ID]

I require:
1. Return pickup arranged at your cost
2. Correct item delivered OR full refund within 48 hours

I have photo evidence.`,

      angry:
`Support,

I received completely the WRONG ITEM! Your warehouse quality control is clearly broken.

Order ID: [Add your Order ID]

I want immediate return pickup (at YOUR cost) and my correct item OR a full refund. If not fixed in 48 hours, I'm filing a consumer complaint and disputing the charge.`
    }),

    damaged: () => ({
      polite:
`Hi Support Team 😊

My order arrived but the product was damaged — it looks like it happened during transit or due to poor packaging. I can share photos to help! Could I get a replacement or refund?

Order ID: [Add your Order ID]

Thank you! 🙏`,

      neutral:
`Hello Support,

My recent order arrived with the product visibly damaged, likely due to transit handling or inadequate packaging.

Order ID: [Add your Order ID]

I request a replacement with an undamaged product or a full refund. Photos available.`,

      firm:
`To Customer Support,

My order arrived with the product clearly damaged. Your packaging or delivery handling has failed.

Order ID: [Add your Order ID]

I demand:
• Replacement with an undamaged item, OR
• Full refund

Arrange return pickup and process within 48 hours. I have photographic evidence.`,

      angry:
`Support,

I received a COMPLETELY DAMAGED product! This is unacceptable.

Order ID: [Add your Order ID]

I want a REPLACEMENT or FULL REFUND immediately. I have photos of everything. If not resolved, I will dispute the charge, file a consumer complaint, and let everyone know how you treat customers.`
    }),

    refund: () => ({
      polite:
`Hi Support Team 😊

I returned an item a while ago and was expecting a refund, but it hasn't appeared in my account yet. Could you check the status and let me know when to expect it?

Order ID: [Add your Order ID]
Return ID (if any): [Add Return ID]

Thank you! 🙏`,

      neutral:
`Hello Support,

I completed a return but the refund has not been credited yet.

Order ID: [Add your Order ID]
Return ID: [Add if available]

Please check the status and confirm when the refund will be processed.`,

      firm:
`To Customer Support,

My return was completed and confirmed, yet the refund has NOT been processed. You now have my item AND my money.

Order ID: [Add your Order ID]

I require the refund to be processed immediately. If not done within 24 hours, I will escalate to your grievance officer and my bank.`,

      angry:
`Support,

WHERE IS MY REFUND?! My return was accepted and you have my product — where is my money?!

Order ID: [Add your Order ID]

Process my refund RIGHT NOW. If I don't see it credited within 24 hours, I am filing a consumer court case and disputing the charge with my bank.`
    }),

    return_issue: () => ({
      polite:
`Hi Support Team 😊

I'm having trouble initiating a return — the option isn't available or my request was rejected. I believe I'm within the return window and have a valid reason. Could you please look into this?

Order ID: [Add your Order ID]
Reason: [Describe your reason]

Thank you so much! 🙏`,

      neutral:
`Hello Support,

My return request has been rejected or is unavailable, despite being within the return window.

Order ID: [Add your Order ID]
Reason: [Describe your reason]

Please review and approve the return, and arrange pickup.`,

      firm:
`To Customer Support,

My return request was wrongly rejected. I am within the return period and have a legitimate reason.

Order ID: [Add your Order ID]

I demand you approve my return immediately and arrange pickup at no charge. If unresolved, I will escalate to your consumer grievance portal.`,

      angry:
`Support,

My return request was REJECTED for no valid reason! I am within the return window and have every right to return this item.

Order ID: [Add your Order ID]

Approve my return NOW and arrange pickup. This violates consumer protection laws. If you refuse, I will file a complaint with the National Consumer Helpline and pursue this in consumer court.`
    }),

    size_issue: () => ({
      polite:
`Hi Support Team 😊

I received my order but unfortunately the size doesn't fit as expected. The sizing on the website didn't match what actually arrived. I'd love to exchange it for the correct size or get a refund if an exchange isn't possible!

Order ID: [Add your Order ID]
Size ordered: [e.g. M] | Size received: [e.g. M] | Actual fit: [e.g. runs very small]

Thank you! 🙏`,

      neutral:
`Hello Support,

The item I received does not fit as expected. The sizing is inconsistent with what was indicated on the product page.

Order ID: [Add your Order ID]
Size ordered: [Size] | Fit issue: [Describe — e.g. too small, too large]

Please arrange an exchange for the correct size or process a full refund.`,

      firm:
`To Customer Support,

The item I received does not fit despite ordering the correct size as per your size chart. This is a product listing inaccuracy.

Order ID: [Add your Order ID]
Size ordered: [Size] | Issue: [Describe fit problem]

I require either:
• Exchange for the correct size at no extra charge, OR
• Full refund with free return pickup

Resolve within 48 hours.`,

      angry:
`Support,

Your size chart is WRONG or the product is mislabelled — what I received does not fit at all despite ordering the right size.

Order ID: [Add your Order ID]
Size ordered: [Size] | What arrived: [Describe]

I want an immediate exchange or FULL REFUND. Arrange return pickup at your cost — this is entirely your fault. If not resolved promptly, I will dispute the charge and file a consumer complaint.`
    }),

    not_as_shown: () => ({
      polite:
`Hi Support Team 😊

I received my order but it looks quite different from what was shown in the product images and description on the website. The colour, material, or quality doesn't match at all. I'd appreciate a return and refund please!

Order ID: [Add your Order ID]
What was shown: [Describe listing]
What I received: [Describe actual product]

Thank you! 🙏`,

      neutral:
`Hello Support,

The product I received does not match the images or description on your platform. The listing is misleading.

Order ID: [Add your Order ID]
Discrepancy: [Describe difference — colour, material, quality, etc.]

Please arrange a return and process a full refund. This is a case of product misrepresentation.`,

      firm:
`To Customer Support,

The product I received is significantly different from what was advertised — this is misrepresentation. The images, description, and actual item do not match.

Order ID: [Add your Order ID]
Listed as: [Describe] | Received: [Describe]

I demand a full refund with free return pickup. I have photo evidence of the discrepancy. Resolve within 48 hours.`,

      angry:
`Support,

What I received looks NOTHING like the product shown on your website! This is false advertising and I feel completely cheated.

Order ID: [Add your Order ID]
Listed as: [Describe] | What arrived: [Describe]

I want a FULL REFUND and a free return pickup — immediately. If not resolved, I will report this listing as fraudulent and file a consumer complaint. You cannot sell products with misleading images and descriptions!`
    }),

    fake_product: () => ({
      polite:
`Hi Support Team 😊

I'm concerned that the product I received may not be genuine. It looks and feels very different from the authentic version, and some details (packaging, labels, build quality) seem off.

Order ID: [Add your Order ID]
Product: [Product name and brand]

I'd appreciate a full refund and would like this to be investigated. Thank you! 🙏`,

      neutral:
`Hello Support,

I have reason to believe the product I received is not genuine/authentic. The quality, packaging, and finishing are inconsistent with the real product.

Order ID: [Add your Order ID]
Product: [Product name and brand]

I request a full refund and ask that you investigate the seller. Selling counterfeit products is illegal.`,

      firm:
`To Customer Support,

The product I received appears to be counterfeit. It does not match the quality, packaging, or details of a genuine product. This is a serious issue.

Order ID: [Add your Order ID]
Product: [Product name and brand]
Seller: [Seller name if visible]

I demand:
• Immediate full refund
• Investigation and action against the seller
• Confirmation that counterfeit goods are being removed from your platform

I have documentation. Selling fake products is a criminal offence.`,

      angry:
`Support,

I was sold a FAKE, COUNTERFEIT product! This is completely illegal and I am furious.

Order ID: [Add your Order ID]
Product: [Product name and brand]
Seller: [Seller name if visible]

I want a FULL REFUND immediately and I expect the seller to be removed from your platform. If this is not addressed urgently, I will report this to the brand directly, file a police complaint for sale of counterfeit goods, and escalate to the consumer forum. This is fraud!`
    }),

    missing_parts: () => ({
      polite:
`Hi Support Team 😊

I received my order but it's missing some parts or accessories that should have been included — the product isn't complete or usable without them. Could you help arrange the missing parts or a replacement?

Order ID: [Add your Order ID]
Missing: [Describe missing parts/accessories]

Thank you! 🙏`,

      neutral:
`Hello Support,

My recent order arrived with parts or accessories missing. The product is incomplete.

Order ID: [Add your Order ID]
Missing item(s): [Describe what's missing]

Please either send the missing parts or arrange a replacement of the complete product.`,

      firm:
`To Customer Support,

My order arrived incomplete — key parts or accessories that should be in the box are missing. The product is unusable in this state.

Order ID: [Add your Order ID]
Missing: [Describe missing parts/accessories]

I require:
• Delivery of the missing parts, OR
• Full replacement of the complete product, OR
• Full refund

Resolve within 48 hours.`,

      angry:
`Support,

My product arrived INCOMPLETE — critical parts are missing and I cannot use what I paid for!

Order ID: [Add your Order ID]
Missing: [Describe missing parts/accessories]

Either send me the missing parts IMMEDIATELY or replace the entire product. If neither is possible, I want a FULL REFUND. This is unacceptable — I paid for a complete product and received a broken, unusable one.`
    }),
  },


  rides: {
    driver_cancelled: () => ({
      polite:
`Hi Support Team 😊

My driver cancelled my ride just before arriving, leaving me stranded and causing me to be late. I understand it happens sometimes, but it was really inconvenient. Could you look into this?

Ride ID: [Add your Ride ID]
Date/Time: [Add details]

Thanks! 🙏`,

      neutral:
`Hello Support,

My driver cancelled my ride after I had already waited, causing significant inconvenience.

Ride ID: [Add your Ride ID]

I request a review of this incident and appropriate action. Some compensation for the inconvenience would also be appreciated.`,

      firm:
`To Customer Support,

My driver cancelled after I waited, making me late for an important commitment.

Ride ID: [Add your Ride ID]

I require:
• Investigation into this driver's cancellation record
• Compensation (credit or coupon) for my inconvenience

Please confirm the action taken.`,

      angry:
`Support,

My driver CANCELLED on me after I waited! I was late to something critical because of this!

Ride ID: [Add your Ride ID]

I demand an investigation into this driver AND compensation for my wasted time and additional expenses. If not addressed, I will file a complaint and leave detailed public reviews warning other users.`
    }),

    overcharged: () => ({
      polite:
`Hi Support Team 😊

I noticed the fare charged for my recent ride seems higher than the estimate shown at booking. Could you please review the fare? It might be an error.

Ride ID: [Add your Ride ID]
Estimated: ₹[Amount] | Charged: ₹[Amount]

Thank you! 🙏`,

      neutral:
`Hello Support,

I was charged more than the fare estimated at booking. The difference is significant.

Ride ID: [Add your Ride ID]
Expected: ₹[Amount] | Charged: ₹[Amount]

Please review the billing and refund the excess amount.`,

      firm:
`To Customer Support,

I was overcharged for my recent ride. The amount deducted is significantly more than the booking estimate.

Ride ID: [Add your Ride ID]
Estimated: ₹[Amount] | Charged: ₹[Amount]

I have screenshots. Please refund the excess amount within 24 hours.`,

      angry:
`Support,

I was OVERCHARGED for my ride! You quoted one fare and charged me significantly more — this is fraud!

Ride ID: [Add your Ride ID]
Charged: ₹[Amount] vs Estimated: ₹[Amount]

Refund the excess RIGHT NOW. If not done immediately, I will file a consumer complaint and report this to the appropriate authorities.`
    }),

    no_show: () => ({
      polite:
`Hi Support Team 😊

My driver accepted my ride but never arrived at the pickup point. I waited for a long time before having to cancel. Could you please waive any cancellation charges and look into this?

Ride ID: [Add your Ride ID]

Thank you! 🙏`,

      neutral:
`Hello Support,

My driver accepted my ride but did not arrive at the pickup location. I waited extensively before cancelling.

Ride ID: [Add your Ride ID]

I request:
• Cancellation charge waiver (if applied)
• Review of the driver's behaviour`,

      firm:
`To Customer Support,

My driver accepted my ride and never showed up. Any cancellation fee applied is unjust — this was entirely the driver's fault.

Ride ID: [Add your Ride ID]

I demand:
1. Immediate waiver of any cancellation fee
2. Action against the driver

I should not be penalised for a driver's failure.`,

      angry:
`Support,

My driver NEVER SHOWED UP! I waited and now there's a cancellation fee — for something that is 100% the driver's fault?!

Ride ID: [Add your Ride ID]

Remove ALL cancellation charges IMMEDIATELY and take action against this driver. If a single rupee is charged to me, I will dispute it with my bank and file a consumer complaint.`
    }),

    lost_item: () => ({
      polite:
`Hi Support Team 😊

I think I left something behind in the vehicle during my recent ride. It's quite important to me. Could you please help connect me with the driver or facilitate recovery?

Ride ID: [Add your Ride ID]
Item description: [Describe the item]
Date/Time: [Add details]

Thank you so much! 🙏`,

      neutral:
`Hello Support,

I left an item in the vehicle during my recent ride and need help recovering it.

Ride ID: [Add your Ride ID]
Item: [Describe item]
Date/Time: [Add details]

Please connect me with the driver or help facilitate the return of my belongings.`,

      firm:
`To Customer Support,

I left an important item in a vehicle during my recent ride and require immediate assistance.

Ride ID: [Add your Ride ID]
Lost item: [Describe item]

Please connect me with the driver immediately and treat this as a priority request. I expect an update within the hour.`,

      angry:
`Support,

I left something VERY IMPORTANT in your driver's vehicle and I need it back NOW!

Ride ID: [Add your Ride ID]
Lost item: [Describe item]

Connect me with the driver IMMEDIATELY. If my item is not recovered, I will hold you fully responsible. This is your top priority right now.`
    }),

    rude_driver: () => ({
      polite:
`Hi Support Team 😊

I wanted to flag an issue from my recent ride — the driver's behaviour made me uncomfortable. They were rude and unprofessional during the trip. I'm sharing this because I believe you value customer safety and experience.

Ride ID: [Add your Ride ID]
Driver name: [If visible in app]

Thank you for taking this seriously! 🙏`,

      neutral:
`Hello Support,

I'm reporting a driver behaviour complaint. The driver was rude and unprofessional, making the experience uncomfortable.

Ride ID: [Add your Ride ID]
Driver name: [If visible]

Please review and take appropriate action. Professional conduct is a basic requirement.`,

      firm:
`To Customer Support,

I am formally reporting unacceptable driver behaviour from my recent ride. The driver was rude and disrespectful.

Ride ID: [Add your Ride ID]

I require:
• Formal investigation into this driver
• Written confirmation of action taken
• Compensation for the experience

I expect a proper response, not a template reply.`,

      angry:
`Support,

Your driver was RUDE and made me feel UNSAFE during my entire ride. This is completely unacceptable!

Ride ID: [Add your Ride ID]

I want IMMEDIATE action — suspend this driver. And I expect compensation.

If I don't receive a proper response, I will report this to the police, media, and file a formal safety complaint. Safety is non-negotiable.`
    }),
  }
};


// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────

const state = {
  categoryId: null,
  problemId: null,
  toneId: null,
};


// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

const $ = (id) => document.getElementById(id);

function clearSelected(containerSelector) {
  document.querySelectorAll(containerSelector + ' .selected')
    .forEach(el => el.classList.remove('selected'));
}

function tryGenerateMessage() {
  const { categoryId, problemId, toneId } = state;
  if (!categoryId || !problemId || !toneId) return;

  const fn = MESSAGES[categoryId]?.[problemId];
  if (!fn) return;

  const message = fn()[toneId];
  $('message-text').value = message;

  const outputEl = $('output-section');
  outputEl.classList.remove('hidden');

  // Reset AI status
  $('ai-status').classList.add('hidden');
  $('copy-success').classList.add('hidden');

  // Smooth scroll to output
  setTimeout(() => {
    outputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 60);
}


// ─────────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────────

function renderCategories() {
  const grid = $('category-grid');
  CATEGORIES.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'cat-card';
    card.dataset.id = cat.id;
    card.innerHTML = `
      <span class="cat-icon">${cat.icon}</span>
      <span class="cat-name">${cat.name}</span>
      <span class="cat-apps">${cat.apps}</span>
    `;
    card.addEventListener('click', () => onCategorySelect(cat.id));
    grid.appendChild(card);
  });
}

function renderProblems(categoryId) {
  const cat = CATEGORIES.find(c => c.id === categoryId);
  const wrap = $('problem-chips');
  wrap.innerHTML = '';

  cat.problems.forEach(prob => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.dataset.id = prob.id;
    chip.textContent = prob.label;
    chip.addEventListener('click', () => onProblemSelect(prob.id));
    wrap.appendChild(chip);
  });
}

function renderTones() {
  const grid = $('tone-grid');
  TONES.forEach(tone => {
    const card = document.createElement('div');
    card.className = 'tone-card';
    card.dataset.tone = tone.id;
    card.innerHTML = `
      <span class="tone-emoji">${tone.emoji}</span>
      <span class="tone-name">${tone.name}</span>
      <span class="tone-tag">${tone.tag}</span>
      <span class="tone-desc">${tone.desc}</span>
    `;
    card.addEventListener('click', () => onToneSelect(tone.id));
    grid.appendChild(card);
  });
}


// ─────────────────────────────────────────────
// SELECTION HANDLERS
// ─────────────────────────────────────────────

function onCategorySelect(categoryId) {
  state.categoryId = categoryId;
  state.problemId = null;

  // Highlight
  clearSelected('#category-grid');
  document.querySelector(`#category-grid [data-id="${categoryId}"]`).classList.add('selected');

  // Show problem chips
  renderProblems(categoryId);
  clearSelected('#problem-chips');
  $('problem-empty').classList.add('hidden');
  $('problem-chips').classList.remove('hidden');

  // Reset output
  $('output-section').classList.add('hidden');
}

function onProblemSelect(problemId) {
  state.problemId = problemId;

  clearSelected('#problem-chips');
  document.querySelector(`#problem-chips [data-id="${problemId}"]`).classList.add('selected');

  tryGenerateMessage();
}

function onToneSelect(toneId) {
  state.toneId = toneId;

  clearSelected('#tone-grid');
  document.querySelector(`#tone-grid [data-tone="${toneId}"]`).classList.add('selected');

  tryGenerateMessage();
}


// ─────────────────────────────────────────────
// COPY
// ─────────────────────────────────────────────

function onCopy() {
  const text = $('message-text').value;
  if (!text) return;

  const done = () => {
    const el = $('copy-success');
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 2500);
  };

  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => legacyCopy());
  } else {
    legacyCopy();
  }

  function legacyCopy() {
    const ta = $('message-text');
    ta.select();
    ta.setSelectionRange(0, 99999);
    try { document.execCommand('copy'); done(); }
    catch { alert('Please select and copy the message manually.'); }
  }
}


// ─────────────────────────────────────────────
// RESET
// ─────────────────────────────────────────────

function onReset() {
  state.categoryId = null;
  state.problemId  = null;
  state.toneId     = null;

  clearSelected('#category-grid');
  clearSelected('#tone-grid');

  $('problem-chips').classList.add('hidden');
  $('problem-chips').innerHTML = '';
  $('problem-empty').classList.remove('hidden');
  $('output-section').classList.add('hidden');
  $('api-key-box').classList.add('hidden');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ─────────────────────────────────────────────
// AI REGENERATION
// ─────────────────────────────────────────────

const API_KEY_STORAGE = 'cc_anthropic_key';

function getApiKey() {
  return localStorage.getItem(API_KEY_STORAGE) || '';
}

function saveApiKey(key) {
  localStorage.setItem(API_KEY_STORAGE, key.trim());
}

function clearApiKey() {
  localStorage.removeItem(API_KEY_STORAGE);
}

function onAiRegen() {
  const key = getApiKey();
  if (!key) {
    // Show key prompt
    const box = $('api-key-box');
    box.classList.toggle('hidden');
    if (!box.classList.contains('hidden')) {
      $('api-key-input').focus();
    }
    return;
  }
  doAiRegen(key);
}

async function doAiRegen(apiKey) {
  const currentMessage = $('message-text').value;
  if (!currentMessage) return;

  const toneLabel = TONES.find(t => t.id === state.toneId)?.name || 'polite';
  const statusEl = $('ai-status');
  const regenBtn = $('btn-ai-regen');

  statusEl.textContent = '✦ Generating…';
  statusEl.classList.remove('hidden');
  regenBtn.disabled = true;

  const prompt = `You are a customer support message writer for Indian users.

Generate a DIFFERENT variation of the following support complaint message. Keep the same tone (${toneLabel}) and the same core complaint, but use completely different wording and sentence structure. Maintain any [placeholders] exactly as they are.

Return ONLY the message text — no explanation, no quotes, no preamble.

Original message:
${currentMessage}`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error ${res.status}`);
    }

    const data = await res.json();
    const newMessage = data.content?.[0]?.text?.trim();

    if (newMessage) {
      $('message-text').value = newMessage;
      statusEl.textContent = '✦ New variation generated';
      setTimeout(() => statusEl.classList.add('hidden'), 2500);
    }
  } catch (err) {
    statusEl.textContent = '✕ Error: ' + err.message;
    // If auth error, clear key and show prompt again
    if (err.message.includes('401') || err.message.includes('authentication')) {
      clearApiKey();
      $('api-key-box').classList.remove('hidden');
      $('api-key-input').value = '';
    }
  } finally {
    regenBtn.disabled = false;
  }
}

function onSaveKey() {
  const key = $('api-key-input').value.trim();
  if (!key || !key.startsWith('sk-ant')) {
    $('api-key-input').style.borderColor = '#EF4444';
    setTimeout(() => $('api-key-input').style.borderColor = '', 1500);
    return;
  }
  saveApiKey(key);
  $('api-key-box').classList.add('hidden');
  $('api-key-input').value = '';
  doAiRegen(key);
}

function onClearKey() {
  clearApiKey();
  $('api-key-input').value = '';
  $('api-key-box').classList.remove('hidden');
}


// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

function init() {
  renderCategories();
  renderTones();

  $('btn-copy').addEventListener('click', onCopy);
  $('btn-reset').addEventListener('click', onReset);
  $('btn-ai-regen').addEventListener('click', onAiRegen);
  $('btn-save-key').addEventListener('click', onSaveKey);
  $('btn-clear-key').addEventListener('click', onClearKey);

  // Allow Enter key in API key input
  $('api-key-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') onSaveKey();
  });
}

document.addEventListener('DOMContentLoaded', init);
