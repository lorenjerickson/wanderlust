# Actor Data Model

This document records the agreed actor-domain model. One normalization is important: `approved` belongs to campaign participation, not the actor itself, because approval is specific to a GM and campaign.

## Core actor

```ts
type AuditFields = {
  id: string
  createdAt: Date
  createdByUserId: string | null
  updatedAt: Date
  updatedByUserId: string | null
  deletedAt: Date | null
}

type ActorStatus = "draft" | "inactive" | "active" | "deleted"

type Actor = AuditFields & {
  ownerUserId: string
  status: ActorStatus

  officialName: string       // trimmed, immutable, max 120
  shortName: string          // trimmed, immutable, max 24
  bioMarkdown: string        // required, mutable, max 2,000

  level: number              // 1–20, milestone-based
  baseHealth: number
  damageTaken: number
  baseWalkingSpeed: number   // defaults to 5 feet/second

  strength: number
  dexterity: number
  constitution: number
  intelligence: number
  wisdom: number
  charisma: number
  sanity: number

  ethnicity: ActorSnapshot
  primaryProfession: ActorProfession
  secondaryProfession: ActorProfession | null
  talent: ActorSnapshot | null

  portrait: ActorImage
  token: ActorImage
}
```

Active official and short names are globally unique using trimmed, case-insensitive comparisons. Soft-deleted actors release both names for reuse.

## Campaign participation

```ts
type ParticipationStatus =
  | "invited"
  | "preparing"
  | "submitted"
  | "approved"
  | "active"
  | "completed"
  | "removed"
  | "withdrawn"

type CampaignParticipation = AuditFields & {
  campaignId: string
  actorId: string
  userId: string
  status: ParticipationStatus

  invitedAt: Date
  submittedAt: Date | null
  approvedAt: Date | null
  joinedAt: Date | null
  leftAt: Date | null
  leaveReasonMarkdown: string | null
}
```

An actor may have only one active participation. Completed actors may join another campaign. Removal or withdrawal revokes access through that campaign; completed participation preserves historical GM read access.

Campaign constraints should be structured predicates evaluated against the actor, such as level limits, required new actors, allowed catalog entries, and other eligibility rules.

## Catalog artifacts

Global catalogs include:

- Ethnicities
- Professions and profession ranks
- Talents
- Traits
- Quirks
- Items

Their shared shape is approximately:

```ts
type CatalogArtifact = AuditFields & {
  name: string
  descriptionMarkdown: string
  tags: string[]
  createdByRole: "admin" | "gm"
  createdByUserId: string
}
```

Names are globally unique and case-insensitive. Referenced entries use soft deletion, display an “in use” indicator, and cannot be selected for new actors. Admins can read/write everything; GMs can create global entries and modify their own entries.

## Snapshots and provenance

Ethnicity, professions, talent, traits, quirks, and items are copied into actor-owned snapshots when selected, granted, ranked up, or acquired.

```ts
type ActorSnapshot = AuditFields & {
  actorId: string
  artifactType: string
  sourceCatalogId: string
  sourceCatalogUpdatedAt: Date

  name: string
  descriptionMarkdown: string
  tags: string[]
  modifiers: Modifier[]
  effects: MechanicalEffect[]
}
```

Catalog changes never retroactively alter existing snapshots. Future profession ranks use the latest rank definition at the moment the rank is reached.

## Modifiers

```ts
type Modifier = {
  targetType:
    | "attribute"
    | "ability"
    | "health"
    | "defense"
    | "walkingSpeed"
    | "runningSpeed"
    | "swimmingSpeed"

  targetId: string | null
  operation: "add" | "replace"
  value: number
  descriptionMarkdown: string
}

type MechanicalEffect =
  | {
      type: "advantage" | "disadvantage"
      targetType: "attribute" | "ability"
      targetId: string
    }
  | {
      type: "grantTrait" | "grantQuirk"
      catalogId: string
    }
```

Additive modifiers stack. The highest replacement wins. Advantage and disadvantage cancel one-for-one.

## Professions

An actor has one immutable primary profession and zero-or-one immutable secondary profession.

- Primary advancements: levels 3, 6, 9, and 12.
- Secondary advancements: levels 5, 10, and 13.
- Each profession defines its own rank names, defaulting to craftsman terminology.
- Advancement is automatic.
- Rank grants are permanent snapshots.
- A later rank may replace an earlier modifier targeting the same value.
- Starting and rank-granted equipment becomes actor-owned item instances.

## Traits, quirks, and talents

- Traits are exclusively granted, unlimited, and cannot grant other traits or quirks.
- Quirks are exclusively granted, unlimited, and may be beneficial, harmful, or mixed.
- Duplicate trait/quirk grants do not stack.
- Each instance maintains multiple source links.
- Removing one source leaves the instance active while another source remains.
- Removing the final source deletes the actor instance.
- Talent is optional, selected only at creation, immutable, and limited to one.
- Talents may produce numeric effects or advantage on an ability.
- Ethnicity and professions do not grant talents.

## Attributes and abilities

Attribute base scores are assigned by rolling 9d20, discarding the highest and lowest, and assigning the remaining seven results. Only assigned base scores are stored.

Ability modifier:

```ts
Math.floor((effectiveAttribute - 10) / 2)
```

The fixed abilities are:

Acrobatics, Animal Handling, Arcana, Athletics, Deception, History, Insight, Intimidation, Investigation, Medicine, Nature, Perception, Performance, Persuasion, Religion, Sleight of Hand, Stealth, and Survival.

Each has a default governing attribute, although a GM may substitute another for an individual check. There is no proficiency mechanic.

## Health, defense, and speed

```ts
currentHealth =
  baseHealth -
  damageTaken +
  activeHealthModifiers
```

- Level 1 health: `max(1, 1d8 + 5 + Constitution modifier)`.
- Later levels: add `max(1, 1d8 + Constitution modifier)`.
- `damageTaken` may make health negative.
- Active modifiers may raise health above permanent base health.
- Healing reduces `damageTaken`.
- Defense begins at 10 and has no upper bound.
- Walking speed defaults to 5 feet/second.
- Running speed defaults to twice walking speed.
- Swimming speed defaults to half walking speed.
- Movement-mode modifiers may override those derived values.

## Equipment and inventory

Item definitions include name, Markdown description, tags, type, weight, value, stackability, maximum stack size, compatible/required slots, modifiers, effects, and optional provided container slots.

Equipment slots:

- `head`
- `neck`
- `torso`
- `arms`
- `mainHand`
- `offHand`
- `hands`
- `legs`
- `feet`
- `belt`
- `pack`

Only equipped belts and packs provide inventory capacity. Items consume one container slot; stackable items share a slot up to `maxStack`. Two-handed items occupy both hand slots. Gloves may coexist with held items.

Item instances preserve unique identity and transfer history. Mutable instance data is limited to quantity, owner, container placement, and equipment placement.

## Source-defined temporary effects

Effects are defined by their source but create lightweight applied records:

```ts
type AppliedEffect = AuditFields & {
  actorId: string
  sourceType: string
  sourceInstanceId: string
  appliedByActorId: string | null
  modifiers: Modifier[]

  appliedAt: Date
  durationUnit:
    | "turn"
    | "round"
    | "second"
    | "minute"
    | "hour"
    | "day"
    | "event"
  duration: number | null
  expiresAt: Date | null
  remainingTicks: number | null
}
```

Reapplication from the same source instance and actor refreshes duration. Different weapon instances or applying actors stack. Damage-over-time increases `damageTaken`.

## Images

Each actor requires one replaceable portrait and token.

```ts
type ActorImage = AuditFields & {
  actorId: string
  kind: "portrait" | "token"
  source: "upload" | "generated"

  originalStorageKey: string
  variantStorageKeys: Record<string, string>

  mimeType: string
  width: number
  height: number
  fileSize: number
  checksum: string
  altText: string

  generationId: string | null
  replacedAt: Date | null
}
```

Portraits support PNG, JPEG, and WebP. Tokens support transparent PNG or WebP and include their own frame. Files are limited to 5 MB, validated, resized, and stripped of embedded metadata. Replaced images remain recoverable.

Suggested storage keys:

- `assets/images/portraits/{actor-id}/{actor-short-name}-portrait.webp`
- `assets/images/tokens/{actor-id}/{actor-short-name}-token.png`

## AI generation

AI generation operates on private drafts and can generate or regenerate individual actor sections. It must reference existing catalog IDs, enforce campaign constraints, and allow complete manual overrides.

Generation records preserve:

- Provider and model
- Prompt
- Summarized world/campaign context and versions
- Structured output
- Requesting user
- Accepted/rejected status
- Timestamps

All sheet details, generation history, attributes, abilities, inventory, professions, ethnicity, traits, quirks, talent, health, and effects are visible only to the owner, authorized GM, and admins. Portrait and token art may also be seen by participants in the actor’s current campaign.

## Permissions and deletion

- A user may own many actors; each actor has exactly one owner.
- Owners may edit bio, art, equipment placement, and inventory.
- Only the current campaign GM may change level, damage/healing, campaign participation, and applied effects.
- Admins have unrestricted read/write access.
- Actor deletion is soft deletion.
- Admin deletion of a user also soft-deletes every artifact owned by that user, including actors.
- Standard audit fields apply to every domain entity.
