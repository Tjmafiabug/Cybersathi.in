-- Sample published content for CyberSathi.in — gives blog/news/video pages
-- something to render before the automation pipelines are wired up.
-- Idempotent: safe to re-run (keyed by unique slugs / youtube_id / url hash).
--
-- Apply with: pnpm db:seed-content

-- ----------------------------------------------------------------------------
-- Blogs (6 — one per flagship category)
-- ----------------------------------------------------------------------------
insert into public.blogs (
  slug, title, meta_description, body_md, cover_image_url, category_id,
  status, author, published_at, ai_generated, ai_model
)
values
  (
    'upi-fraud-india-how-scammers-drain-accounts-in-2026',
    'UPI fraud in India: how scammers drain accounts in 2026',
    'The seven most common UPI scams hitting Indian users this year, how they work, and how to stop them cold.',
    E'## Why UPI is a scammer''s favourite rail\n\nUPI processed over 16 billion transactions in a single month last year. That volume is a gift to fraudsters — every lapse in attention is a door.\n\n## The seven most common playbooks\n\n- **"Wrong number" money requests** — a "Collect Request" that looks like an incoming payment but is actually a debit.\n- **Fake customer-support numbers** on Google that impersonate banks and walk you through "refund" flows that steal OTPs.\n- **QR-code scams** at railway stations and roadside stalls — scanning to *receive* money never requires a PIN.\n- **Screen-sharing apps** (AnyDesk, TeamViewer) installed under the guise of "KYC help".\n- **Deepfake voice calls** from "family members" asking for emergency UPI transfers.\n- **Dating-app romance scams** that slowly escalate from chat to "just send me ₹500 for the cab".\n- **Job-offer scams** demanding a refundable "registration fee" over UPI.\n\n## What actually works to stop it\n\n1. **Never enter your UPI PIN to *receive* money.** This is the single rule that defeats most of the above.\n2. Lock your UPI app with a biometric, not just a 4-digit code.\n3. Report fraud within 24 hours to **1930** (the national cyber-crime helpline) and on **cybercrime.gov.in**. Banks are much more likely to reverse a transaction flagged inside that window.\n4. Turn on SMS alerts for every debit, however small.\n5. Keep a low daily UPI limit on your primary bank. ₹25,000 is plenty for day-to-day use.\n\n## If you''ve already been hit\n\nFile the 1930 complaint first, then visit your branch with the acknowledgement number. RBI''s *Positive Pay* and *zero-liability* frameworks give you real leverage — but only if the paper trail is started fast.',
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1600&auto=format&fit=crop&q=80',
    (select id from public.categories where slug = 'upi-fraud'),
    'published', 'CyberSathi Desk',
    now() - interval '2 days', 0, null
  ),
  (
    'spot-a-phishing-email-in-30-seconds',
    'Spot a phishing email in 30 seconds',
    'The four signals that sort real email from phishing — and the one trap that catches everyone.',
    E'## Phishing doesn''t look like Nigerian princes anymore\n\nModern phishing is boring-looking. A "shared Google Doc". A "DHL delivery notice". An "unusual sign-in from Chennai". That''s the point — it blends in.\n\n## Four signals, in order\n\n1. **Sender domain mismatch.** The display name says "ICICI Bank" but the address is `secure-update@icici-verify.co`. Always read the domain, not the name.\n2. **Urgency + consequence.** "Your account will be locked in 2 hours." Real banks do not do this over email.\n3. **Link vs. label.** Hover over any link before clicking. If the underlying URL doesn''t match the visible text, leave.\n4. **Unsolicited attachments.** Especially `.zip`, `.html`, and office docs asking you to enable macros.\n\n## The one trap that catches everyone\n\n**Reply-to hijacking inside a real thread.** An attacker compromises a colleague''s mailbox and replies *inside* an existing conversation you trust — correct subject line, correct signature, correct context. The only tell is a sudden request to pay / forward / click.\n\n**Rule:** any financial or credential ask inside an existing thread gets a phone-call confirmation. Always.\n\n## What to do if you clicked\n\n- Disconnect from Wi-Fi / cellular immediately.\n- Change the password of *the account the email claimed to be from*, on a different device.\n- Turn on MFA everywhere, starting with email and bank.\n- If it was a work device, tell IT within the hour, not the day. Early notification is the difference between a close call and a breach.',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1600&auto=format&fit=crop&q=80',
    (select id from public.categories where slug = 'phishing'),
    'published', 'CyberSathi Desk',
    now() - interval '5 days', 0, null
  ),
  (
    'ransomware-playbook-what-indian-smbs-should-do-on-day-zero',
    'Ransomware playbook: what Indian SMBs should do on day zero',
    'If your screens are showing a ransom note right now, do these six things in this order — before anything else.',
    E'## First, don''t pay. Not yet.\n\nPaying is sometimes rational, but it is never the *first* decision. The first decision is **containment**.\n\n## The day-zero checklist\n\n1. **Disconnect — don''t shut down.** Pulling network cables freezes the encryption process without wiping volatile evidence.\n2. **Photograph the ransom note.** Full screen, including the timer and the wallet address. You will need this for CERT-In and for your insurer.\n3. **Identify the strain.** Upload the note to **id-ransomware.malwarehunterteam.com**. The strain dictates whether a free decryptor exists.\n4. **Isolate backups — physically.** If your backup server is on the same network, assume it is being encrypted as you read this.\n5. **Report to CERT-In.** The 6-hour window under the 2022 directive is real. Email `incident@cert-in.org.in` with what you have.\n6. **Call outside counsel and your cyber-insurance broker** before calling the attackers. Coverage may be voided by premature engagement.\n\n## Whether to pay\n\nThere is no clean answer. But the considerations are:\n\n- Is a decryptor publicly available? (If yes, never pay.)\n- Are your backups actually restorable, or just present?\n- Is data-exfiltration + leak the real threat, rather than encryption?\n- What does your insurer require?\n\nMost SMBs that pay are ones with no tested restore procedure. Test your backups this quarter.',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600&auto=format&fit=crop&q=80',
    (select id from public.categories where slug = 'ransomware'),
    'published', 'CyberSathi Desk',
    now() - interval '9 days', 0, null
  ),
  (
    'what-a-data-breach-notification-really-means-and-what-to-do',
    'What a data-breach notification really means (and what to do)',
    'So your inbox says your data was leaked. Here''s how to tell whether to shrug or actually panic.',
    E'## Two kinds of leaks\n\nNot every leak is equal. Sort yours into one of these buckets.\n\n**Bucket A — Low-stakes:** email + hashed password.\n\n**Bucket B — High-stakes:** government ID (Aadhaar / PAN), address, phone, DOB, or cleartext password.\n\n## If you''re in Bucket A\n\n- Check reuse on **haveibeenpwned.com**.\n- Change the password on the breached site and anywhere you reused it.\n- Turn on MFA on that account.\n- You''re done. Move on.\n\n## If you''re in Bucket B\n\nThis is identity-theft territory. Do all of the above, *and*:\n\n- Lock your Aadhaar biometric at **uidai.gov.in**.\n- Get a free credit report from CIBIL / Experian / Equifax; dispute anything you don''t recognise.\n- Set a fraud alert on your primary bank — ask them to flag any address / phone-number change requests.\n- Consider a fresh SIM card if your number was in the dump (SIM-swap risk).\n\n## A note on "delete my data" requests\n\nUnder India''s DPDP Act you have a right to request erasure. In practice the response time is measured in months, and data already leaked cannot be un-leaked. Treat it as a cleanup step, not a fix.',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1600&auto=format&fit=crop&q=80',
    (select id from public.categories where slug = 'data-breaches'),
    'published', 'CyberSathi Desk',
    now() - interval '14 days', 0, null
  ),
  (
    'sim-swap-fraud-when-your-phone-stops-working-in-the-middle-of-the-day',
    'SIM-swap fraud: when your phone stops working in the middle of the day',
    'A quiet phone is sometimes a warning. Here''s what SIM-swap attackers do and the 45-minute window you have to respond.',
    E'## What SIM-swap actually is\n\nAn attacker convinces your telecom operator that they are you and need a replacement SIM. Your phone goes dead. Their phone now receives your OTPs. Fifteen minutes later, your bank balance is elsewhere.\n\n## The warning signs\n\n- Sudden loss of signal — "no service" — when everyone around you has coverage.\n- A text from your telco about a "SIM change request" you didn''t make.\n- Calls from an unknown number asking for an OTP "just to verify".\n\n## The 45-minute window\n\n1. **Borrow any working phone. Call your bank''s 24/7 hotline first**, not the telco. Freeze cards.\n2. Call your telco next. Ask them to reverse the SIM swap and put a SIM-change lock on the account.\n3. File **cybercrime.gov.in** immediately — the timestamped complaint is the single best lever for bank reimbursement.\n4. Change passwords on anything that used SMS-based 2FA (email, bank, UPI apps).\n\n## Preventing it next time\n\n- Move 2FA from SMS to an authenticator app (Authy, Google Authenticator, 1Password).\n- Ask your telco to add a **PUK/port-out PIN** to your account.\n- Never read an OTP aloud on a call. Ever.',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&auto=format&fit=crop&q=80',
    (select id from public.categories where slug = 'identity-theft'),
    'published', 'CyberSathi Desk',
    now() - interval '18 days', 0, null
  ),
  (
    'crypto-telegram-groups-the-indian-investment-scam-of-2026',
    'Crypto Telegram groups: the Indian investment scam of 2026',
    'Why "99 percent accuracy" crypto tip groups are the fastest-growing fraud in India, and how to stop a friend from falling in.',
    E'## The setup\n\nSomeone you vaguely know adds you to a Telegram group. The admin shares "signals". The signals hit. A "senior analyst" DMs you personally. You''re asked to deposit a small amount on an exchange you''ve never heard of — and the number in your account goes up.\n\nSo you deposit more. And that''s where you meet the wall.\n\n## How the scam is structured\n\n1. **Acquisition:** Instagram reels, LinkedIn DMs, random Telegram adds. Scale, not precision.\n2. **Social proof:** bots in the group post fake screenshots of winning trades. The group has 4,000 members; maybe 40 are real.\n3. **Hit-rate manipulation:** early "signals" are rigged to succeed. The admin calls both directions in split groups, and only tells the winning half.\n4. **Fake exchange:** the platform is a clone front-end. Your deposits go to a single wallet. Your "balance" is a text field.\n5. **Withdrawal wall:** when you try to withdraw, you''re told to pay "tax" or "unlock fee" — more money in, none out.\n\n## How to tell a friend (without fighting)\n\n- Ask them to withdraw ₹1,000 right now, to their own bank. If the platform can''t do that cleanly, nothing else matters.\n- Point to the SEBI investor-alert list.\n- Show them the **cybercrime.gov.in** complaint archive — it''s full of this exact playbook.\n\n## If it already happened\n\nFile at **1930** within 24 hours. Get the wallet address of the destination (it''s on every blockchain explorer); attach it to the complaint. Chainalysis and CERT-In occasionally recover funds when the receiving exchange is cooperative.',
    'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=1600&auto=format&fit=crop&q=80',
    (select id from public.categories where slug = 'cryptocurrency'),
    'published', 'CyberSathi Desk',
    now() - interval '22 days', 0, null
  )
on conflict (slug) do update set
  title = excluded.title,
  meta_description = excluded.meta_description,
  body_md = excluded.body_md,
  cover_image_url = excluded.cover_image_url,
  category_id = excluded.category_id,
  status = excluded.status,
  published_at = excluded.published_at,
  updated_at = now();

-- ----------------------------------------------------------------------------
-- News articles (6 — rewritten summaries pointing at real-looking sources)
-- ----------------------------------------------------------------------------
insert into public.news_articles (
  slug, title, summary, source_url, source_url_hash, source_published_at,
  category_id, image_url, status, ai_rewritten
)
values
  (
    'cert-in-warns-of-new-banking-malware-targeting-indian-android-users',
    'CERT-In warns of new banking malware targeting Indian Android users',
    'A new Android banking trojan distributed through SMS-delivered APK links is targeting customers of at least eight Indian banks, according to an advisory from CERT-In this week. The malware, tagged BRATA.IN, overlays fake login screens on legitimate banking apps to harvest credentials and intercept OTPs. CERT-In recommends users stop side-loading APKs from SMS links and review installed apps for anything claiming "SMS read" or "Accessibility" permissions.',
    'https://www.cert-in.org.in/s2cMainServlet?pageid=PUBVLNOTES02&VLCODE=CIAD-2026-0042',
    md5('https://www.cert-in.org.in/s2cMainServlet?pageid=PUBVLNOTES02&VLCODE=CIAD-2026-0042'),
    now() - interval '6 hours',
    (select id from public.categories where slug = 'malware'),
    'https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=1600&auto=format&fit=crop&q=80',
    'published', 1
  ),
  (
    'over-2-lakh-jio-customer-records-listed-on-breach-forum',
    'Over 2 lakh Jio customer records listed on breach forum',
    'A sample of ~200,000 records containing names, email addresses, and partial phone numbers attributed to Reliance Jio customers was listed on a well-known data-leak forum over the weekend. The seller claims a larger 60-million-row database is available to buyers. Jio has not yet confirmed the breach; security researchers who reviewed the sample say the timestamps suggest data pulled from a customer-support portal rather than the main subscriber database.',
    'https://example.com/news/jio-leak-2026-04',
    md5('https://example.com/news/jio-leak-2026-04'),
    now() - interval '1 day',
    (select id from public.categories where slug = 'data-breaches'),
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&auto=format&fit=crop&q=80',
    'published', 1
  ),
  (
    'mumbai-police-bust-whatsapp-job-scam-ring-arrests-eleven',
    'Mumbai Police bust WhatsApp job-scam ring, arrests eleven',
    'Mumbai Police cyber-cell arrested eleven people running a WhatsApp-based fake-job scam that netted an estimated ₹8.4 crore over nine months. Victims were added to WhatsApp groups, offered "social-media liking" jobs paying ₹50 per task, and escalated to "investment tasks" requiring deposits of ₹10,000–₹5 lakh. Police traced the funds through 43 mule accounts across four states.',
    'https://example.com/news/mumbai-job-scam-bust',
    md5('https://example.com/news/mumbai-job-scam-bust'),
    now() - interval '2 days',
    (select id from public.categories where slug = 'investment-fraud'),
    'https://images.unsplash.com/photo-1589820296156-2454bb8a6ad1?w=1600&auto=format&fit=crop&q=80',
    'published', 1
  ),
  (
    'deepfake-ceo-audio-call-triggers-3-crore-transfer-at-bengaluru-firm',
    'Deepfake CEO audio call triggers ₹3 crore transfer at Bengaluru firm',
    'A Bengaluru mid-market IT services company''s finance head authorised a ₹3.1 crore transfer after a five-minute voice call that convincingly impersonated the CEO, according to a police complaint filed this week. The call used a cloned voice model likely trained on publicly available interview clips. The funds were routed through a Hong Kong shell account and are unlikely to be recovered. CERT-In has issued guidance recommending out-of-band verification for all wire transfers over ₹25 lakh.',
    'https://example.com/news/deepfake-ceo-bengaluru',
    md5('https://example.com/news/deepfake-ceo-bengaluru'),
    now() - interval '3 days',
    (select id from public.categories where slug = 'social-engineering'),
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1600&auto=format&fit=crop&q=80',
    'published', 1
  ),
  (
    'rbi-tightens-upi-collect-request-rules-after-22-pc-jump-in-complaints',
    'RBI tightens UPI "collect request" rules after 22% jump in complaints',
    'The Reserve Bank of India has directed NPCI to cap "collect requests" — the UPI flow where a merchant requests payment that the payer approves — at ₹2,000 for merchants not on the verified-merchant list, following a 22% year-over-year jump in fraud complaints tied to fake collect requests. The cap takes effect next quarter. Payment apps will also be required to display a mandatory "You are PAYING, not receiving" banner on the approval screen.',
    'https://example.com/news/rbi-upi-collect-cap',
    md5('https://example.com/news/rbi-upi-collect-cap'),
    now() - interval '5 days',
    (select id from public.categories where slug = 'upi-fraud'),
    'https://images.unsplash.com/photo-1556742400-b5b7c5121f6b?w=1600&auto=format&fit=crop&q=80',
    'published', 1
  ),
  (
    'ransomware-group-claims-attack-on-indian-logistics-major',
    'Ransomware group claims attack on Indian logistics major',
    'A ransomware group operating under the name "BlackVault" has listed an unnamed Indian logistics and trucking company on its data-leak site, claiming to have exfiltrated 1.4 TB of internal data including customer manifests, employee records, and financial spreadsheets. The group is demanding a ransom in the "low eight-figure dollar" range. The company''s public tracking portal has been offline for three days; an employee notice circulated on social media describes a "significant IT disruption" and asks customers to call regional offices directly.',
    'https://example.com/news/blackvault-logistics-attack',
    md5('https://example.com/news/blackvault-logistics-attack'),
    now() - interval '6 days',
    (select id from public.categories where slug = 'ransomware'),
    'https://images.unsplash.com/photo-1551808525-51a94da548ce?w=1600&auto=format&fit=crop&q=80',
    'published', 1
  )
on conflict (slug) do update set
  title = excluded.title,
  summary = excluded.summary,
  category_id = excluded.category_id,
  image_url = excluded.image_url,
  status = excluded.status;

-- ----------------------------------------------------------------------------
-- Videos (6 — YouTube IDs with explicit thumbnails so indexes look good even
-- when an ID is stale; detail page embed URL may show "unavailable" for fake IDs)
-- ----------------------------------------------------------------------------
insert into public.videos (
  slug, youtube_id, title, description, channel_name, channel_id, published_at,
  duration_seconds, thumbnail_url, summary, timestamps, category_id, status
)
values
  (
    'how-password-managers-actually-work',
    'w68BBPDAWr8',
    'How password managers actually work (and why you need one)',
    'A walkthrough of how modern password managers generate, store, and sync credentials — and the trust model that makes them safer than reusing passwords.',
    'Computerphile', 'UC9-y-6csu5WGm29I7JiwpnA', now() - interval '3 days',
    712,
    'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=1200&auto=format&fit=crop&q=80',
    'A clear, non-salesy explanation of password-manager architecture: zero-knowledge encryption, vault sync, and where a bad implementation can leak. Good 101 for users getting off reused passwords.',
    '[{"t":0,"label":"Why reusing passwords is fatal"},{"t":120,"label":"Zero-knowledge encryption"},{"t":310,"label":"Vault sync and backups"},{"t":540,"label":"Common implementation mistakes"}]'::jsonb,
    (select id from public.categories where slug = 'phishing'),
    'published'
  ),
  (
    'upi-fraud-explained-in-5-minutes',
    '8EkIP9GW0dE',
    'UPI fraud explained in 5 minutes',
    'The three-step UPI fraud flow most victims fall into, with live reconstructions from NPCI dispute data.',
    'The Ken', 'UC_rfnqsfqqXqLfVvqKVQZcg', now() - interval '6 days',
    308,
    'https://images.unsplash.com/photo-1556742205-e10c9486e506?w=1200&auto=format&fit=crop&q=80',
    'Short, tight explainer. The host walks through "collect request" spoofing, QR-code scams at public spaces, and customer-support impersonation. Useful to share with parents.',
    '[{"t":0,"label":"The volume problem"},{"t":60,"label":"Collect request spoofing"},{"t":150,"label":"QR codes at stalls"},{"t":240,"label":"Fake customer support"}]'::jsonb,
    (select id from public.categories where slug = 'upi-fraud'),
    'published'
  ),
  (
    'inside-a-ransomware-negotiation',
    'lTjPFqpfZN0',
    'Inside a ransomware negotiation',
    'A former incident responder walks through an actual ransomware chat log (anonymised) and explains what works and what backfires at the table.',
    'Black Hat', 'UCJ6q9Ie29ajGqKApbLqfBOg', now() - interval '10 days',
    1823,
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
    'Rare look at the human dynamics of ransom negotiation. The speaker makes the case for slow-walking, proves attacker claims with free data samples, and reads tells from grammar and timezone markers.',
    '[{"t":0,"label":"The initial note"},{"t":300,"label":"Proof-of-data demands"},{"t":720,"label":"Reading the attacker"},{"t":1200,"label":"When to walk"}]'::jsonb,
    (select id from public.categories where slug = 'ransomware'),
    'published'
  ),
  (
    'aadhaar-biometric-lock-walkthrough',
    'H1sTnj_Sn9Y',
    'Aadhaar biometric lock: full walkthrough',
    'Five-minute screen-recorded walkthrough of locking and unlocking your Aadhaar biometric via the UIDAI portal and mSharma app.',
    'CyberSathi', 'UC_placeholder_cybersathi', now() - interval '12 days',
    342,
    'https://images.unsplash.com/photo-1562577308-9e66f0c65ce5?w=1200&auto=format&fit=crop&q=80',
    'Exactly the screen-by-screen the UIDAI documentation doesn''t show cleanly. Includes the "why this matters" pitch for sceptical family members.',
    '[{"t":0,"label":"Why you want this on"},{"t":60,"label":"UIDAI portal method"},{"t":180,"label":"mAadhaar app method"},{"t":260,"label":"Unlocking temporarily"}]'::jsonb,
    (select id from public.categories where slug = 'identity-theft'),
    'published'
  ),
  (
    'deepfake-voice-scams-how-they-work',
    'Yq3ZHYv0L6k',
    'Deepfake voice scams: how they work',
    'A security researcher demonstrates cloning a voice from publicly available clips in under 4 minutes, and the enterprise controls that stop the scam even when the voice is perfect.',
    'DEF CON', 'UC6Om9kAkl32dWlDSNlDS9Iw', now() - interval '16 days',
    1456,
    'https://images.unsplash.com/photo-1589254065878-42c9da997008?w=1200&auto=format&fit=crop&q=80',
    'Technical but accessible. The researcher stresses that countermeasures need to be procedural (callback, code-word) not technical — voice-authentication vendors are chasing a losing arms race.',
    '[{"t":0,"label":"Cloning demo"},{"t":300,"label":"Why detection fails"},{"t":680,"label":"Procedural defences"},{"t":1100,"label":"Policy recommendations"}]'::jsonb,
    (select id from public.categories where slug = 'social-engineering'),
    'published'
  ),
  (
    'crypto-rug-pulls-anatomy-of-a-scam',
    'pBb6bRbJQdc',
    'Crypto rug pulls: anatomy of a scam',
    'A chain-analyst walks through three recent Indian-language Telegram rug pulls, tracing funds across exchanges and naming the on-chain tells that predicted each.',
    'Chainalysis', 'UCy_oX-Cg4cOs3_f7d2IYfnQ', now() - interval '20 days',
    1024,
    'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=1200&auto=format&fit=crop&q=80',
    'Concrete, data-backed. The key takeaway: liquidity-pool composition and deployer-wallet history predict most rug pulls. Useful for anyone on the investor side of the crypto ecosystem.',
    '[{"t":0,"label":"What is a rug pull"},{"t":180,"label":"Case 1: Telegram tip group"},{"t":480,"label":"Case 2: fake DEX launch"},{"t":780,"label":"On-chain tells"}]'::jsonb,
    (select id from public.categories where slug = 'cryptocurrency'),
    'published'
  )
on conflict (slug) do update set
  title = excluded.title,
  description = excluded.description,
  thumbnail_url = excluded.thumbnail_url,
  summary = excluded.summary,
  timestamps = excluded.timestamps,
  category_id = excluded.category_id,
  status = excluded.status;
