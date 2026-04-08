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
  },
  {
    id: 'telecom',
    icon: '📱',
    name: 'Telecom',
    apps: 'Airtel · Jio · Vi (Vodafone Idea)',
    problems: [
      { id: 'no_network',              label: 'No signal / call drops' },
      { id: 'data_not_working',        label: 'Mobile data not working' },
      { id: 'wrong_deduction',         label: 'Balance deducted without reason' },
      { id: 'recharge_not_activated',  label: 'Recharge not activated' },
      { id: 'unwanted_charges',        label: 'Unwanted subscription charged' },
      { id: 'port_stuck',              label: 'Number port (MNP) stuck' },
    ]
  },
  {
    id: 'broadband',
    icon: '📡',
    name: 'Broadband',
    apps: 'ACT · Jio Fiber · Airtel Xstream · Hathway',
    problems: [
      { id: 'no_internet',             label: 'Internet completely down' },
      { id: 'slow_speed',              label: 'Speed much slower than plan' },
      { id: 'frequent_drops',          label: 'Connection keeps dropping' },
      { id: 'technician_no_show',      label: 'Technician didn\'t show up' },
      { id: 'wrong_bill',              label: 'Wrong bill / overcharged' },
      { id: 'new_connection_delayed',  label: 'New connection not installed' },
    ]
  },
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
  },

  // ─── TELECOM ────────────────────────────────

  telecom: {
    no_network: () => ({
      polite:
`Hi Support Team 😊

I've been experiencing very poor network signal and frequent call drops in my area for the past few days. I've already tried restarting my phone and reinserting the SIM, but the issue persists.

Mobile Number: [Your number]
Location: [Your area/city]

Could you please look into this and let me know when it will be resolved? Thank you! 🙏`,

      neutral:
`Hello Support,

I am facing persistent network issues — poor signal and frequent call drops at my location.

Mobile Number: [Your number]
Location: [Your area/city]
Issue since: [Date]

Please investigate and resolve at the earliest. Confirm once action is taken.`,

      firm:
`To Customer Support,

I have been experiencing consistent network failure — no signal and call drops — for several days now. This is affecting my work and daily communication.

Mobile Number: [Your number]
Location: [Your area/city]

I expect this to be escalated to your network team and resolved within 24 hours. If not, I will be filing a complaint with TRAI.`,

      angry:
`Support,

My network has been USELESS for days — constant call drops, zero signal. I am paying for a service I am NOT receiving!

Mobile Number: [Your number]
Location: [Your area/city]

Fix this IMMEDIATELY or I will file a formal complaint with TRAI (Telecom Regulatory Authority of India) and port my number out. This is completely unacceptable!`
    }),

    data_not_working: () => ({
      polite:
`Hi Support Team 😊

My mobile data has stopped working even though I have an active plan with data balance remaining. I've tried turning airplane mode on/off and restarting, but no luck.

Mobile Number: [Your number]
Current Plan: [Plan name/amount]

Could you please check what's going on and help fix this? Thank you! 🙏`,

      neutral:
`Hello Support,

My mobile data is not working despite having an active plan with sufficient balance.

Mobile Number: [Your number]
APN settings have been verified. Device restarted. Issue persists.

Please check from your end and resolve. Confirm once done.`,

      firm:
`To Customer Support,

My mobile data is completely non-functional despite an active paid plan. This has been going on for too long and is unacceptable.

Mobile Number: [Your number]
Plan active: Yes | Data balance: Available

I need this fixed within the next few hours. If not resolved today, I will approach TRAI with a formal complaint.`,

      angry:
`Support,

I am paying for a data plan that DOES NOT WORK. My internet is down, I've done every troubleshooting step possible, and still nothing!

Mobile Number: [Your number]

Fix my data RIGHT NOW or I will file a TRAI complaint and switch operators immediately. I refuse to pay for a service that doesn't work!`
    }),

    wrong_deduction: () => ({
      polite:
`Hi Support Team 😊

I noticed that my prepaid balance was deducted without any call, SMS, or data usage on my end. I haven't activated any new service either.

Mobile Number: [Your number]
Amount deducted: ₹[Amount]
Date/Time: [When it happened]

Could you please check and refund the wrongly deducted amount? Thank you! 🙏`,

      neutral:
`Hello Support,

An unauthorized deduction was made from my prepaid balance. I did not initiate any purchase, activation, or usage that would explain this charge.

Mobile Number: [Your number]
Amount: ₹[Amount]
Date/Time: [When it happened]

Please investigate and reverse the deduction immediately.`,

      firm:
`To Customer Support,

My account balance was deducted without my consent or any corresponding usage. This is an unauthorized charge.

Mobile Number: [Your number]
Amount deducted: ₹[Amount]
Date/Time: [When]

I demand an immediate refund of the wrongly deducted amount. If not resolved within 24 hours, I will file a complaint with TRAI for unauthorized charges.`,

      angry:
`Support,

Money was STOLEN from my balance — I made no calls, used no data, activated nothing. Yet ₹[Amount] is gone!

Mobile Number: [Your number]
Date/Time: [When]

REFUND MY MONEY IMMEDIATELY. This is fraud. If not reversed right now, I am filing a TRAI complaint and escalating to the consumer forum. You cannot take money from customers without reason!`
    }),

    recharge_not_activated: () => ({
      polite:
`Hi Support Team 😊

I did a recharge for my number but the plan hasn't been activated yet. The money was deducted from my account but my current plan and balance haven't changed.

Mobile Number: [Your number]
Recharge Amount: ₹[Amount]
Transaction ID: [Your transaction ID]
Recharge Date/Time: [When]

Could you please activate the plan or refund the amount? Thank you! 🙏`,

      neutral:
`Hello Support,

I recharged my number but the plan has not been activated. Payment was successful but the benefits haven't reflected.

Mobile Number: [Your number]
Amount: ₹[Amount]
Transaction ID: [Your transaction ID]
Date: [Date]

Please activate the plan immediately or issue a refund.`,

      firm:
`To Customer Support,

I completed a recharge and my payment was deducted, but the plan has NOT been activated. I have the transaction proof.

Mobile Number: [Your number]
Amount: ₹[Amount]
Transaction ID: [Your transaction ID]

Either activate the plan within the next 2 hours or refund the full amount. I will not let this go unresolved.`,

      angry:
`Support,

I paid ₹[Amount] for a recharge and got NOTHING in return! Money taken, plan not activated — this is cheating!

Mobile Number: [Your number]
Transaction ID: [Your transaction ID]

ACTIVATE MY PLAN RIGHT NOW or REFUND THE MONEY. If this isn't resolved in the next hour, I am filing a consumer complaint and disputing the charge with my bank!`
    }),

    unwanted_charges: () => ({
      polite:
`Hi Support Team 😊

I noticed a deduction from my balance for a subscription or VAS service that I never signed up for. I definitely did not activate this intentionally.

Mobile Number: [Your number]
Service charged for: [Service name if known]
Amount deducted: ₹[Amount]

Could you please deactivate this service and refund the amount? Thank you! 🙏`,

      neutral:
`Hello Support,

A VAS/subscription service has been activated on my number without my consent, and my balance has been deducted for it.

Mobile Number: [Your number]
Unwanted service: [Service name if known]
Amount deducted: ₹[Amount]

Please deactivate the service immediately and refund the deducted amount.`,

      firm:
`To Customer Support,

An unauthorized subscription has been activated on my number and money deducted without my explicit consent. This practice of activating paid services without clear user approval is unacceptable.

Mobile Number: [Your number]
Service: [Service name if known]
Amount: ₹[Amount]

I demand: (1) Immediate deactivation of the service, (2) Full refund. TRAI regulations prohibit activating VAS without double confirmation — I will report this if not resolved.`,

      angry:
`Support,

You ACTIVATED a paid service on my number WITHOUT MY CONSENT and deducted my balance! This is a clear TRAI violation!

Mobile Number: [Your number]
Amount stolen: ₹[Amount]

DEACTIVATE IT AND REFUND MY MONEY NOW. I will be filing a complaint with TRAI (which mandates double opt-in for VAS) and the consumer forum if this isn't fixed immediately. This is deliberate fraud!`
    }),

    port_stuck: () => ({
      polite:
`Hi Support Team 😊

I submitted a request to port my number to another network, but the process seems to be stuck. It's been much longer than the expected timeframe and my number hasn't been ported yet.

Mobile Number: [Your number]
UPC Code: [Your UPC code]
Port request date: [Date]
New operator: [New operator name]

Could you help me understand the status and get this resolved? Thank you! 🙏`,

      neutral:
`Hello Support,

My Mobile Number Portability (MNP) request has not been processed within the stipulated time period.

Mobile Number: [Your number]
UPC Code: [Your UPC code]
Request submitted: [Date]

As per TRAI guidelines, porting must be completed within 5 working days. Please process this immediately.`,

      firm:
`To Customer Support,

My number portability request has been delayed beyond the TRAI-mandated timeline. This is a regulatory violation.

Mobile Number: [Your number]
UPC Code: [Your UPC code]
Request date: [Date]

I demand immediate processing of my port request. Any deliberate delay in MNP processing is a violation of TRAI regulations and I will report it as such.`,

      angry:
`Support,

My number port request has been ILLEGALLY DELAYED. TRAI mandates porting within 5 working days — you are in VIOLATION of this regulation!

Mobile Number: [Your number]
UPC Code: [Your UPC code]
Request date: [Date]

Process my port request IMMEDIATELY. I am simultaneously filing a complaint with TRAI for deliberate obstruction of my right to port. This is unacceptable and illegal!`
    }),
  },

  // ─── BROADBAND ──────────────────────────────

  broadband: {
    no_internet: () => ({
      polite:
`Hi Support Team 😊

My broadband connection has been completely down since [time/date]. I've tried restarting the router multiple times but the issue persists. All lights on the router seem off or showing an error.

Registered Account/Number: [Your account number or registered mobile]
Location: [Your address/area]

Could you please look into this urgently? I'm working from home and this is quite critical. Thank you! 🙏`,

      neutral:
`Hello Support,

My broadband internet connection is completely down. Router restart has not resolved the issue.

Account Number: [Your account number]
Address: [Your address]
Outage since: [Date and time]

Please dispatch a technician or resolve remotely at the earliest. Confirm ETA.`,

      firm:
`To Customer Support,

My broadband connection has been down for [X hours/days] with no resolution or communication from your end. This is severely impacting my work.

Account Number: [Your account number]
Address: [Your address]

I need a technician at my location within 24 hours and a confirmed resolution time. If not resolved, I will be claiming a service credit for downtime and escalating to TRAI.`,

      angry:
`Support,

My internet has been DOWN for [X hours/days] and nobody has bothered to fix it or even communicate with me!

Account Number: [Your account number]

Get a technician to my location TODAY. If this isn't resolved by end of day, I will file a TRAI complaint for service disruption, claim a full refund for the downtime period, and cancel my connection. This is completely unacceptable!`
    }),

    slow_speed: () => ({
      polite:
`Hi Support Team 😊

I'm subscribed to a [X Mbps] plan but I've been consistently getting speeds much lower than that — sometimes as low as [actual speed]. I've tested this multiple times using speed test tools at different hours.

Account Number: [Your account number]
Plan speed: [X Mbps]
Getting: [Actual speed]
Speed test screenshots: Available

Could you please investigate and fix this? Thank you! 🙏`,

      neutral:
`Hello Support,

I am not receiving the internet speeds I am paying for. My plan promises [X Mbps] but consistent speed tests show [actual speed].

Account Number: [Your account number]
Plan: [Plan name] — [X Mbps]
Actual speed: [Speed from test]
Tested at: [Multiple times/dates]

Please investigate and restore speeds to the promised level.`,

      firm:
`To Customer Support,

I have been receiving significantly lower speeds than my subscribed plan for an extended period. This is a breach of the service I am paying for.

Account Number: [Your account number]
Promised speed: [X Mbps] | Actual speed: [Y Mbps]

I expect the issue to be diagnosed and resolved within 48 hours. If speeds are not restored to the plan level, I will demand a pro-rated refund and escalate to TRAI for not delivering contracted service.`,

      angry:
`Support,

I am paying for [X Mbps] and getting [Y Mbps] — that is [%] of what I'm paying for! This is cheating!

Account Number: [Your account number]

Either DELIVER THE SPEEDS I AM PAYING FOR or give me a refund for every day I've been getting substandard service. If this isn't fixed this week, I am cancelling my connection, filing a TRAI complaint, and making sure people know about your false speed claims.`
    }),

    frequent_drops: () => ({
      polite:
`Hi Support Team 😊

My broadband connection keeps dropping multiple times throughout the day. It reconnects after a few minutes but the constant interruptions are making it impossible to work, attend video calls, or stream anything reliably.

Account Number: [Your account number]
Address: [Your address]
How often it drops: [e.g., 5–10 times a day]

Could you please check the line or send a technician? Thank you! 🙏`,

      neutral:
`Hello Support,

My broadband connection is frequently disconnecting throughout the day. The instability is causing major disruption to work and online activities.

Account Number: [Your account number]
Address: [Your address]
Drop frequency: [Approx. times per day]

Please check for line faults or routing issues and resolve. Confirm action taken.`,

      firm:
`To Customer Support,

My connection has been dropping [X] times a day for the past [X days]. This is not an acceptable level of service and restarting the router is not a fix.

Account Number: [Your account number]
Address: [Your address]

I need a technician to diagnose the root cause — line fault, equipment issue, or otherwise — and permanently resolve it within 48 hours. Temporary fixes will not be accepted.`,

      angry:
`Support,

My connection drops CONSTANTLY — multiple times every single day. I cannot work, I cannot attend meetings, I cannot do anything reliably!

Account Number: [Your account number]

Send a technician TOMORROW who will ACTUALLY FIX THIS, not just restart the router. If this keeps happening after the visit, I am cancelling my subscription, demanding a full refund for this month, and filing a TRAI complaint for consistently failing to deliver stable service!`
    }),

    technician_no_show: () => ({
      polite:
`Hi Support Team 😊

I had a technician visit scheduled for today between [time slot] but no one showed up. I took time off to be available and there was no call or message about a delay or rescheduling.

Account Number: [Your account number]
Complaint/Ticket Number: [If available]
Scheduled visit: [Date and time slot]

Could you please reschedule urgently and ensure someone actually shows up this time? Thank you! 🙏`,

      neutral:
`Hello Support,

A technician was scheduled to visit my premises today but did not arrive. No prior communication was received about rescheduling or delay.

Account Number: [Your account number]
Ticket Number: [If available]
Scheduled slot: [Date, time]

Please reschedule within the next 24 hours and confirm the appointment. I cannot keep taking time off for missed visits.`,

      firm:
`To Customer Support,

A technician was booked to visit today and did not show up — no call, no message, nothing. This is a complete waste of my time.

Account Number: [Your account number]
Missed appointment: [Date, time slot]

I expect a technician at my location within the next 24 hours. If another no-show occurs, I will escalate this formally and demand compensation for the repeated inconvenience.`,

      angry:
`Support,

Your technician was booked for today and SIMPLY DIDN'T COME. No call, no message, nothing. I waited at home specifically for this!

Account Number: [Your account number]
Missed visit: [Date, time]

Send someone TOMORROW without fail — no more excuses. If there is another no-show, I am cancelling my connection, filing a consumer complaint, and making sure others know how unreliable your service team is. This is completely unacceptable!`
    }),

    wrong_bill: () => ({
      polite:
`Hi Support Team 😊

I received my latest bill and the amount seems higher than my plan charges. I'd like to understand what the extra charges are for, as I don't believe I've used any additional services.

Account Number: [Your account number]
Plan amount: ₹[Plan cost]
Billed amount: ₹[Billed cost]
Bill date/cycle: [Month/period]

Could you please review and correct this? Thank you! 🙏`,

      neutral:
`Hello Support,

My latest broadband bill is higher than my plan amount. I have not added any services or exceeded my plan limits.

Account Number: [Your account number]
Expected amount: ₹[Plan cost]
Billed amount: ₹[Billed cost]

Please review the bill, explain any additional charges, and issue a corrected invoice or credit note.`,

      firm:
`To Customer Support,

I have been overbilled this month. The amount charged is higher than my subscribed plan with no explanation for the difference.

Account Number: [Your account number]
Plan: ₹[Plan cost]/month | Billed: ₹[Billed cost]

I will not pay the excess amount until a detailed and accurate bill is provided. Please issue a corrected bill within 48 hours or I will withhold the excess and escalate to TRAI.`,

      angry:
`Support,

You have OVERCHARGED me this month! My plan costs ₹[Plan cost] and you've billed me ₹[Billed cost] with ZERO explanation!

Account Number: [Your account number]

Issue a corrected bill and refund the excess IMMEDIATELY. I will not pay an incorrect bill. If this isn't sorted, I am filing a TRAI complaint for billing fraud and disputing the charge with my bank. You cannot randomly charge customers extra!`
    }),

    new_connection_delayed: () => ({
      polite:
`Hi Support Team 😊

I applied for a new broadband connection and made the payment, but the installation hasn't happened yet. It's been longer than the promised installation timeline.

Name: [Your name]
Registered Mobile: [Your number]
Application/Order ID: [Your ID]
Payment date: [Date]
Promised installation by: [Date]

Could you please give me an update and arrange the installation at the earliest? Thank you! 🙏`,

      neutral:
`Hello Support,

I applied and paid for a new broadband connection but installation has not been completed within the promised timeframe.

Application ID: [Your ID]
Registered Mobile: [Your number]
Payment date: [Date]
Expected installation: [Date promised]

Please schedule and complete the installation within the next 48 hours, or process a full refund.`,

      firm:
`To Customer Support,

I applied and paid for a new broadband connection on [date] with a promised installation by [date]. That deadline has passed with no installation and no communication.

Application ID: [Your ID]
Amount paid: ₹[Amount]

I require installation within the next 48 hours. If that is not possible, I demand a complete refund of the amount paid. Further delay is unacceptable.`,

      angry:
`Support,

I paid ₹[Amount] for a new connection on [date] and NOBODY has come to install it! [X days] have passed since your promised installation date!

Application ID: [Your ID]

Either install my connection TOMORROW or REFUND MY MONEY IN FULL. I will not wait any longer. If neither happens, I am filing a consumer court complaint and disputing the charge with my bank. Taking money and not delivering the service is fraud!`
    }),
  },
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

  // Restart fade-in animation
  $('message-text').classList.remove('revealed');
  void $('message-text').offsetWidth;
  $('message-text').classList.add('revealed');

  const outputEl = $('output-section');
  outputEl.classList.remove('hidden');
  $('copy-success').classList.add('hidden');
  $('ai-status').classList.add('hidden');

  setTimeout(() => outputEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 60);
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

function launchConfetti() {
  const container = $('confetti-container');
  const colors = ['#4F46E5', '#818CF8', '#E0E7FF', '#6366F1', '#A5B4FC', '#C7D2FE'];
  const btn = $('btn-copy').getBoundingClientRect();
  const originX = btn.left + btn.width / 2;
  const originY = btn.top + btn.height / 2;

  for (let i = 0; i < 32; i++) {
    const dot = document.createElement('div');
    dot.className = 'confetti-dot';
    const size = 4 + Math.random() * 7;
    dot.style.cssText = [
      `left: ${originX + (Math.random() - 0.5) * 120}px`,
      `top: ${originY}px`,
      `width: ${size}px`,
      `height: ${size}px`,
      `background: ${colors[Math.floor(Math.random() * colors.length)]}`,
      `border-radius: ${Math.random() > 0.4 ? '50%' : '2px'}`,
      `animation-duration: ${0.55 + Math.random() * 0.7}s`,
      `animation-delay: ${Math.random() * 0.25}s`,
    ].join(';');
    container.appendChild(dot);
    setTimeout(() => dot.remove(), 1400);
  }
}

function onCopy() {
  const text = $('message-text').value;
  if (!text) return;

  const done = () => {
    // Celebration copy text
    const btn = $('btn-copy');
    btn.textContent = 'Copied! Now go send it 💪';
    setTimeout(() => { btn.textContent = 'Copy message'; }, 2500);

    const el = $('copy-success');
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 2500);

    launchConfetti();
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

  window.scrollTo({ top: 0, behavior: 'smooth' });
}


// ─────────────────────────────────────────────
// AI REGENERATION — powered by Pollinations.ai (free, no key)
// ─────────────────────────────────────────────

async function onAiRegen() {
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
    const res = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [{ role: 'user', content: prompt }],
        model: 'openai',
        seed: Math.floor(Math.random() * 9999),
        private: true
      })
    });

    if (!res.ok) throw new Error(`Error ${res.status}`);

    const newMessage = (await res.text()).trim();

    if (newMessage) {
      $('message-text').value = newMessage;
      statusEl.textContent = '✦ New variation ready';
      setTimeout(() => statusEl.classList.add('hidden'), 2500);
    }
  } catch (err) {
    statusEl.textContent = '✕ Could not reach AI — try again';
    setTimeout(() => statusEl.classList.add('hidden'), 3000);
  } finally {
    regenBtn.disabled = false;
  }
}


// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────

function startEmojiCycle() {
  const sequence = ['😤', '😮‍💨', '😌', '💪'];
  let idx = 0;
  const el = $('calm-emoji');

  setInterval(() => {
    // Fade + shrink out
    el.style.opacity = '0';
    el.style.transform = 'scale(0.6)';
    setTimeout(() => {
      idx = (idx + 1) % sequence.length;
      el.textContent = sequence[idx];
      el.style.opacity = '1';
      el.style.transform = 'scale(1)';
    }, 180);
  }, 2000);
}

function init() {
  renderCategories();
  renderTones();
  startEmojiCycle();

  $('btn-copy').addEventListener('click', onCopy);
  $('btn-reset').addEventListener('click', onReset);
  $('btn-ai-regen').addEventListener('click', onAiRegen);
}

document.addEventListener('DOMContentLoaded', init);
