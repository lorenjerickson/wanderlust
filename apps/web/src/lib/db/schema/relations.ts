import { relations } from 'drizzle-orm/relations'
import {
    roles,
    userRoles,
    users,
    worlds,
    campaigns,
    userPlayerCharacters,
    campaignPlayers,
    scenarios,
    encounters,
    worldArtifacts,
    actors,
    campaignParticipations,
    campaignActorConstraints,
    catalogArtifacts,
    professionRanks,
    catalogModifiers,
    catalogEffects,
    itemDefinitions,
    itemSlotRules,
    actorArtifactSnapshots,
    actorSnapshotSources,
    actorSnapshotModifiers,
    actorSnapshotEffects,
    actorItems,
    actorItemModifiers,
    actorItemSlotRules,
    actorEquipmentPlacements,
    actorItemTransfers,
    appliedEffects,
    appliedEffectModifiers,
    actorImages,
    actorGenerationRecords,
    campaignGms,
    actorItemEffects,
} from './index'

export const userRolesRelations = relations(userRoles, ({ one }) => ({
    role: one(roles, {
        fields: [userRoles.roleId],
        references: [roles.id],
    }),
    user: one(users, {
        fields: [userRoles.userId],
        references: [users.id],
    }),
}))

export const rolesRelations = relations(roles, ({ many }) => ({
    userRoles: many(userRoles),
}))

export const usersRelations = relations(users, ({ many }) => ({
    userRoles: many(userRoles),
    userPlayerCharacters: many(userPlayerCharacters),
    actors_updatedByUserId: many(actors, {
        relationName: 'actors_updatedByUserId_users_id',
    }),
    actors_createdByUserId: many(actors, {
        relationName: 'actors_createdByUserId_users_id',
    }),
    actors_ownerUserId: many(actors, {
        relationName: 'actors_ownerUserId_users_id',
    }),
    campaignParticipations_updatedByUserId: many(campaignParticipations, {
        relationName: 'campaignParticipations_updatedByUserId_users_id',
    }),
    campaignParticipations_createdByUserId: many(campaignParticipations, {
        relationName: 'campaignParticipations_createdByUserId_users_id',
    }),
    campaignParticipations_userId: many(campaignParticipations, {
        relationName: 'campaignParticipations_userId_users_id',
    }),
    campaignActorConstraints_updatedByUserId: many(campaignActorConstraints, {
        relationName: 'campaignActorConstraints_updatedByUserId_users_id',
    }),
    campaignActorConstraints_createdByUserId: many(campaignActorConstraints, {
        relationName: 'campaignActorConstraints_createdByUserId_users_id',
    }),
    catalogArtifacts_updatedByUserId: many(catalogArtifacts, {
        relationName: 'catalogArtifacts_updatedByUserId_users_id',
    }),
    catalogArtifacts_createdByUserId: many(catalogArtifacts, {
        relationName: 'catalogArtifacts_createdByUserId_users_id',
    }),
    professionRanks_updatedByUserId: many(professionRanks, {
        relationName: 'professionRanks_updatedByUserId_users_id',
    }),
    professionRanks_createdByUserId: many(professionRanks, {
        relationName: 'professionRanks_createdByUserId_users_id',
    }),
    catalogModifiers_updatedByUserId: many(catalogModifiers, {
        relationName: 'catalogModifiers_updatedByUserId_users_id',
    }),
    catalogModifiers_createdByUserId: many(catalogModifiers, {
        relationName: 'catalogModifiers_createdByUserId_users_id',
    }),
    catalogEffects_updatedByUserId: many(catalogEffects, {
        relationName: 'catalogEffects_updatedByUserId_users_id',
    }),
    catalogEffects_createdByUserId: many(catalogEffects, {
        relationName: 'catalogEffects_createdByUserId_users_id',
    }),
    itemDefinitions_updatedByUserId: many(itemDefinitions, {
        relationName: 'itemDefinitions_updatedByUserId_users_id',
    }),
    itemDefinitions_createdByUserId: many(itemDefinitions, {
        relationName: 'itemDefinitions_createdByUserId_users_id',
    }),
    itemSlotRules_updatedByUserId: many(itemSlotRules, {
        relationName: 'itemSlotRules_updatedByUserId_users_id',
    }),
    itemSlotRules_createdByUserId: many(itemSlotRules, {
        relationName: 'itemSlotRules_createdByUserId_users_id',
    }),
    actorArtifactSnapshots_updatedByUserId: many(actorArtifactSnapshots, {
        relationName: 'actorArtifactSnapshots_updatedByUserId_users_id',
    }),
    actorArtifactSnapshots_createdByUserId: many(actorArtifactSnapshots, {
        relationName: 'actorArtifactSnapshots_createdByUserId_users_id',
    }),
    actorSnapshotSources_updatedByUserId: many(actorSnapshotSources, {
        relationName: 'actorSnapshotSources_updatedByUserId_users_id',
    }),
    actorSnapshotSources_createdByUserId: many(actorSnapshotSources, {
        relationName: 'actorSnapshotSources_createdByUserId_users_id',
    }),
    actorSnapshotModifiers_updatedByUserId: many(actorSnapshotModifiers, {
        relationName: 'actorSnapshotModifiers_updatedByUserId_users_id',
    }),
    actorSnapshotModifiers_createdByUserId: many(actorSnapshotModifiers, {
        relationName: 'actorSnapshotModifiers_createdByUserId_users_id',
    }),
    actorSnapshotEffects_updatedByUserId: many(actorSnapshotEffects, {
        relationName: 'actorSnapshotEffects_updatedByUserId_users_id',
    }),
    actorSnapshotEffects_createdByUserId: many(actorSnapshotEffects, {
        relationName: 'actorSnapshotEffects_createdByUserId_users_id',
    }),
    actorItems_updatedByUserId: many(actorItems, {
        relationName: 'actorItems_updatedByUserId_users_id',
    }),
    actorItems_createdByUserId: many(actorItems, {
        relationName: 'actorItems_createdByUserId_users_id',
    }),
    actorItemModifiers_updatedByUserId: many(actorItemModifiers, {
        relationName: 'actorItemModifiers_updatedByUserId_users_id',
    }),
    actorItemModifiers_createdByUserId: many(actorItemModifiers, {
        relationName: 'actorItemModifiers_createdByUserId_users_id',
    }),
    actorItemSlotRules_updatedByUserId: many(actorItemSlotRules, {
        relationName: 'actorItemSlotRules_updatedByUserId_users_id',
    }),
    actorItemSlotRules_createdByUserId: many(actorItemSlotRules, {
        relationName: 'actorItemSlotRules_createdByUserId_users_id',
    }),
    actorEquipmentPlacements_updatedByUserId: many(actorEquipmentPlacements, {
        relationName: 'actorEquipmentPlacements_updatedByUserId_users_id',
    }),
    actorEquipmentPlacements_createdByUserId: many(actorEquipmentPlacements, {
        relationName: 'actorEquipmentPlacements_createdByUserId_users_id',
    }),
    actorItemTransfers_updatedByUserId: many(actorItemTransfers, {
        relationName: 'actorItemTransfers_updatedByUserId_users_id',
    }),
    actorItemTransfers_createdByUserId: many(actorItemTransfers, {
        relationName: 'actorItemTransfers_createdByUserId_users_id',
    }),
    appliedEffects_updatedByUserId: many(appliedEffects, {
        relationName: 'appliedEffects_updatedByUserId_users_id',
    }),
    appliedEffects_createdByUserId: many(appliedEffects, {
        relationName: 'appliedEffects_createdByUserId_users_id',
    }),
    appliedEffectModifiers_updatedByUserId: many(appliedEffectModifiers, {
        relationName: 'appliedEffectModifiers_updatedByUserId_users_id',
    }),
    appliedEffectModifiers_createdByUserId: many(appliedEffectModifiers, {
        relationName: 'appliedEffectModifiers_createdByUserId_users_id',
    }),
    actorImages_updatedByUserId: many(actorImages, {
        relationName: 'actorImages_updatedByUserId_users_id',
    }),
    actorImages_createdByUserId: many(actorImages, {
        relationName: 'actorImages_createdByUserId_users_id',
    }),
    actorGenerationRecords_updatedByUserId: many(actorGenerationRecords, {
        relationName: 'actorGenerationRecords_updatedByUserId_users_id',
    }),
    actorGenerationRecords_createdByUserId: many(actorGenerationRecords, {
        relationName: 'actorGenerationRecords_createdByUserId_users_id',
    }),
    actorGenerationRecords_ownerUserId: many(actorGenerationRecords, {
        relationName: 'actorGenerationRecords_ownerUserId_users_id',
    }),
    campaignGms_updatedByUserId: many(campaignGms, {
        relationName: 'campaignGms_updatedByUserId_users_id',
    }),
    campaignGms_createdByUserId: many(campaignGms, {
        relationName: 'campaignGms_createdByUserId_users_id',
    }),
    campaignGms_userId: many(campaignGms, {
        relationName: 'campaignGms_userId_users_id',
    }),
    worlds_ownerUserId: many(worlds, {
        relationName: 'worlds_ownerUserId_users_id',
    }),
    actorItemEffects_updatedByUserId: many(actorItemEffects, {
        relationName: 'actorItemEffects_updatedByUserId_users_id',
    }),
    actorItemEffects_createdByUserId: many(actorItemEffects, {
        relationName: 'actorItemEffects_createdByUserId_users_id',
    }),
}))

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
    world: one(worlds, {
        fields: [campaigns.worldId],
        references: [worlds.id],
    }),
    campaignPlayers: many(campaignPlayers),
    scenarios: many(scenarios),
    campaignParticipations: many(campaignParticipations),
    campaignActorConstraints: many(campaignActorConstraints),
    actorGenerationRecords: many(actorGenerationRecords),
    campaignGms: many(campaignGms),
}))

export const worldsRelations = relations(worlds, ({ one, many }) => ({
    owner: one(users, {
        fields: [worlds.ownerUserId],
        references: [users.id],
        relationName: 'worlds_ownerUserId_users_id',
    }),
    campaigns: many(campaigns),
    worldArtifacts: many(worldArtifacts),
}))

export const userPlayerCharactersRelations = relations(
    userPlayerCharacters,
    ({ one, many }) => ({
        user: one(users, {
            fields: [userPlayerCharacters.userId],
            references: [users.id],
        }),
        campaignPlayers: many(campaignPlayers),
    })
)

export const campaignPlayersRelations = relations(
    campaignPlayers,
    ({ one }) => ({
        campaign: one(campaigns, {
            fields: [campaignPlayers.campaignId],
            references: [campaigns.id],
        }),
        userPlayerCharacter: one(userPlayerCharacters, {
            fields: [campaignPlayers.userPlayerCharacterId],
            references: [userPlayerCharacters.id],
        }),
    })
)

export const scenariosRelations = relations(scenarios, ({ one, many }) => ({
    campaign: one(campaigns, {
        fields: [scenarios.campaignId],
        references: [campaigns.id],
    }),
    encounters: many(encounters),
}))

export const encountersRelations = relations(encounters, ({ one }) => ({
    scenario: one(scenarios, {
        fields: [encounters.scenarioId],
        references: [scenarios.id],
    }),
}))

export const worldArtifactsRelations = relations(worldArtifacts, ({ one }) => ({
    world: one(worlds, {
        fields: [worldArtifacts.worldId],
        references: [worlds.id],
    }),
}))

export const actorsRelations = relations(actors, ({ one, many }) => ({
    user_updatedByUserId: one(users, {
        fields: [actors.updatedByUserId],
        references: [users.id],
        relationName: 'actors_updatedByUserId_users_id',
    }),
    user_createdByUserId: one(users, {
        fields: [actors.createdByUserId],
        references: [users.id],
        relationName: 'actors_createdByUserId_users_id',
    }),
    user_ownerUserId: one(users, {
        fields: [actors.ownerUserId],
        references: [users.id],
        relationName: 'actors_ownerUserId_users_id',
    }),
    campaignParticipations: many(campaignParticipations),
    actorArtifactSnapshots: many(actorArtifactSnapshots),
    actorItems: many(actorItems),
    actorEquipmentPlacements: many(actorEquipmentPlacements),
    actorItemTransfers_toActorId: many(actorItemTransfers, {
        relationName: 'actorItemTransfers_toActorId_actors_id',
    }),
    actorItemTransfers_fromActorId: many(actorItemTransfers, {
        relationName: 'actorItemTransfers_fromActorId_actors_id',
    }),
    appliedEffects_appliedByActorId: many(appliedEffects, {
        relationName: 'appliedEffects_appliedByActorId_actors_id',
    }),
    appliedEffects_actorId: many(appliedEffects, {
        relationName: 'appliedEffects_actorId_actors_id',
    }),
    actorImages: many(actorImages),
    actorGenerationRecords: many(actorGenerationRecords),
}))

export const campaignParticipationsRelations = relations(
    campaignParticipations,
    ({ one }) => ({
        user_updatedByUserId: one(users, {
            fields: [campaignParticipations.updatedByUserId],
            references: [users.id],
            relationName: 'campaignParticipations_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [campaignParticipations.createdByUserId],
            references: [users.id],
            relationName: 'campaignParticipations_createdByUserId_users_id',
        }),
        user_userId: one(users, {
            fields: [campaignParticipations.userId],
            references: [users.id],
            relationName: 'campaignParticipations_userId_users_id',
        }),
        actor: one(actors, {
            fields: [campaignParticipations.actorId],
            references: [actors.id],
        }),
        campaign: one(campaigns, {
            fields: [campaignParticipations.campaignId],
            references: [campaigns.id],
        }),
    })
)

export const campaignActorConstraintsRelations = relations(
    campaignActorConstraints,
    ({ one }) => ({
        user_updatedByUserId: one(users, {
            fields: [campaignActorConstraints.updatedByUserId],
            references: [users.id],
            relationName: 'campaignActorConstraints_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [campaignActorConstraints.createdByUserId],
            references: [users.id],
            relationName: 'campaignActorConstraints_createdByUserId_users_id',
        }),
        campaign: one(campaigns, {
            fields: [campaignActorConstraints.campaignId],
            references: [campaigns.id],
        }),
    })
)

export const catalogArtifactsRelations = relations(
    catalogArtifacts,
    ({ one, many }) => ({
        user_updatedByUserId: one(users, {
            fields: [catalogArtifacts.updatedByUserId],
            references: [users.id],
            relationName: 'catalogArtifacts_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [catalogArtifacts.createdByUserId],
            references: [users.id],
            relationName: 'catalogArtifacts_createdByUserId_users_id',
        }),
        professionRanks: many(professionRanks),
        catalogModifiers: many(catalogModifiers),
        catalogEffects_grantedArtifactId: many(catalogEffects, {
            relationName:
                'catalogEffects_grantedArtifactId_catalogArtifacts_id',
        }),
        catalogEffects_artifactId: many(catalogEffects, {
            relationName: 'catalogEffects_artifactId_catalogArtifacts_id',
        }),
        itemDefinitions: many(itemDefinitions),
        actorArtifactSnapshots: many(actorArtifactSnapshots),
        actorSnapshotEffects: many(actorSnapshotEffects),
        actorItems: many(actorItems),
        actorItemEffects: many(actorItemEffects),
    })
)

export const professionRanksRelations = relations(
    professionRanks,
    ({ one, many }) => ({
        user_updatedByUserId: one(users, {
            fields: [professionRanks.updatedByUserId],
            references: [users.id],
            relationName: 'professionRanks_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [professionRanks.createdByUserId],
            references: [users.id],
            relationName: 'professionRanks_createdByUserId_users_id',
        }),
        catalogArtifact: one(catalogArtifacts, {
            fields: [professionRanks.professionId],
            references: [catalogArtifacts.id],
        }),
        catalogModifiers: many(catalogModifiers),
        catalogEffects: many(catalogEffects),
        actorArtifactSnapshots: many(actorArtifactSnapshots),
    })
)

export const catalogModifiersRelations = relations(
    catalogModifiers,
    ({ one }) => ({
        user_updatedByUserId: one(users, {
            fields: [catalogModifiers.updatedByUserId],
            references: [users.id],
            relationName: 'catalogModifiers_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [catalogModifiers.createdByUserId],
            references: [users.id],
            relationName: 'catalogModifiers_createdByUserId_users_id',
        }),
        professionRank: one(professionRanks, {
            fields: [catalogModifiers.professionRankId],
            references: [professionRanks.id],
        }),
        catalogArtifact: one(catalogArtifacts, {
            fields: [catalogModifiers.artifactId],
            references: [catalogArtifacts.id],
        }),
    })
)

export const catalogEffectsRelations = relations(catalogEffects, ({ one }) => ({
    user_updatedByUserId: one(users, {
        fields: [catalogEffects.updatedByUserId],
        references: [users.id],
        relationName: 'catalogEffects_updatedByUserId_users_id',
    }),
    user_createdByUserId: one(users, {
        fields: [catalogEffects.createdByUserId],
        references: [users.id],
        relationName: 'catalogEffects_createdByUserId_users_id',
    }),
    catalogArtifact_grantedArtifactId: one(catalogArtifacts, {
        fields: [catalogEffects.grantedArtifactId],
        references: [catalogArtifacts.id],
        relationName: 'catalogEffects_grantedArtifactId_catalogArtifacts_id',
    }),
    professionRank: one(professionRanks, {
        fields: [catalogEffects.professionRankId],
        references: [professionRanks.id],
    }),
    catalogArtifact_artifactId: one(catalogArtifacts, {
        fields: [catalogEffects.artifactId],
        references: [catalogArtifacts.id],
        relationName: 'catalogEffects_artifactId_catalogArtifacts_id',
    }),
}))

export const itemDefinitionsRelations = relations(
    itemDefinitions,
    ({ one, many }) => ({
        user_updatedByUserId: one(users, {
            fields: [itemDefinitions.updatedByUserId],
            references: [users.id],
            relationName: 'itemDefinitions_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [itemDefinitions.createdByUserId],
            references: [users.id],
            relationName: 'itemDefinitions_createdByUserId_users_id',
        }),
        catalogArtifact: one(catalogArtifacts, {
            fields: [itemDefinitions.artifactId],
            references: [catalogArtifacts.id],
        }),
        itemSlotRules: many(itemSlotRules),
    })
)

export const itemSlotRulesRelations = relations(itemSlotRules, ({ one }) => ({
    user_updatedByUserId: one(users, {
        fields: [itemSlotRules.updatedByUserId],
        references: [users.id],
        relationName: 'itemSlotRules_updatedByUserId_users_id',
    }),
    user_createdByUserId: one(users, {
        fields: [itemSlotRules.createdByUserId],
        references: [users.id],
        relationName: 'itemSlotRules_createdByUserId_users_id',
    }),
    itemDefinition: one(itemDefinitions, {
        fields: [itemSlotRules.itemArtifactId],
        references: [itemDefinitions.artifactId],
    }),
}))

export const actorArtifactSnapshotsRelations = relations(
    actorArtifactSnapshots,
    ({ one, many }) => ({
        user_updatedByUserId: one(users, {
            fields: [actorArtifactSnapshots.updatedByUserId],
            references: [users.id],
            relationName: 'actorArtifactSnapshots_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [actorArtifactSnapshots.createdByUserId],
            references: [users.id],
            relationName: 'actorArtifactSnapshots_createdByUserId_users_id',
        }),
        professionRank: one(professionRanks, {
            fields: [actorArtifactSnapshots.sourceProfessionRankId],
            references: [professionRanks.id],
        }),
        catalogArtifact: one(catalogArtifacts, {
            fields: [actorArtifactSnapshots.sourceArtifactId],
            references: [catalogArtifacts.id],
        }),
        actor: one(actors, {
            fields: [actorArtifactSnapshots.actorId],
            references: [actors.id],
        }),
        actorSnapshotSources: many(actorSnapshotSources),
        actorSnapshotModifiers: many(actorSnapshotModifiers),
        actorSnapshotEffects: many(actorSnapshotEffects),
    })
)

export const actorSnapshotSourcesRelations = relations(
    actorSnapshotSources,
    ({ one }) => ({
        user_updatedByUserId: one(users, {
            fields: [actorSnapshotSources.updatedByUserId],
            references: [users.id],
            relationName: 'actorSnapshotSources_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [actorSnapshotSources.createdByUserId],
            references: [users.id],
            relationName: 'actorSnapshotSources_createdByUserId_users_id',
        }),
        actorArtifactSnapshot: one(actorArtifactSnapshots, {
            fields: [actorSnapshotSources.snapshotId],
            references: [actorArtifactSnapshots.id],
        }),
    })
)

export const actorSnapshotModifiersRelations = relations(
    actorSnapshotModifiers,
    ({ one }) => ({
        user_updatedByUserId: one(users, {
            fields: [actorSnapshotModifiers.updatedByUserId],
            references: [users.id],
            relationName: 'actorSnapshotModifiers_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [actorSnapshotModifiers.createdByUserId],
            references: [users.id],
            relationName: 'actorSnapshotModifiers_createdByUserId_users_id',
        }),
        actorArtifactSnapshot: one(actorArtifactSnapshots, {
            fields: [actorSnapshotModifiers.snapshotId],
            references: [actorArtifactSnapshots.id],
        }),
    })
)

export const actorSnapshotEffectsRelations = relations(
    actorSnapshotEffects,
    ({ one }) => ({
        user_updatedByUserId: one(users, {
            fields: [actorSnapshotEffects.updatedByUserId],
            references: [users.id],
            relationName: 'actorSnapshotEffects_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [actorSnapshotEffects.createdByUserId],
            references: [users.id],
            relationName: 'actorSnapshotEffects_createdByUserId_users_id',
        }),
        catalogArtifact: one(catalogArtifacts, {
            fields: [actorSnapshotEffects.grantedArtifactId],
            references: [catalogArtifacts.id],
        }),
        actorArtifactSnapshot: one(actorArtifactSnapshots, {
            fields: [actorSnapshotEffects.snapshotId],
            references: [actorArtifactSnapshots.id],
        }),
    })
)

export const actorItemsRelations = relations(actorItems, ({ one, many }) => ({
    user_updatedByUserId: one(users, {
        fields: [actorItems.updatedByUserId],
        references: [users.id],
        relationName: 'actorItems_updatedByUserId_users_id',
    }),
    user_createdByUserId: one(users, {
        fields: [actorItems.createdByUserId],
        references: [users.id],
        relationName: 'actorItems_createdByUserId_users_id',
    }),
    actorItem: one(actorItems, {
        fields: [actorItems.containerItemId],
        references: [actorItems.id],
        relationName: 'actorItems_containerItemId_actorItems_id',
    }),
    actorItems: many(actorItems, {
        relationName: 'actorItems_containerItemId_actorItems_id',
    }),
    catalogArtifact: one(catalogArtifacts, {
        fields: [actorItems.sourceArtifactId],
        references: [catalogArtifacts.id],
    }),
    actor: one(actors, {
        fields: [actorItems.actorId],
        references: [actors.id],
    }),
    actorItemModifiers: many(actorItemModifiers),
    actorItemSlotRules: many(actorItemSlotRules),
    actorEquipmentPlacements: many(actorEquipmentPlacements),
    actorItemTransfers: many(actorItemTransfers),
    actorItemEffects: many(actorItemEffects),
}))

export const actorItemModifiersRelations = relations(
    actorItemModifiers,
    ({ one }) => ({
        user_updatedByUserId: one(users, {
            fields: [actorItemModifiers.updatedByUserId],
            references: [users.id],
            relationName: 'actorItemModifiers_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [actorItemModifiers.createdByUserId],
            references: [users.id],
            relationName: 'actorItemModifiers_createdByUserId_users_id',
        }),
        actorItem: one(actorItems, {
            fields: [actorItemModifiers.actorItemId],
            references: [actorItems.id],
        }),
    })
)

export const actorItemSlotRulesRelations = relations(
    actorItemSlotRules,
    ({ one }) => ({
        user_updatedByUserId: one(users, {
            fields: [actorItemSlotRules.updatedByUserId],
            references: [users.id],
            relationName: 'actorItemSlotRules_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [actorItemSlotRules.createdByUserId],
            references: [users.id],
            relationName: 'actorItemSlotRules_createdByUserId_users_id',
        }),
        actorItem: one(actorItems, {
            fields: [actorItemSlotRules.actorItemId],
            references: [actorItems.id],
        }),
    })
)

export const actorEquipmentPlacementsRelations = relations(
    actorEquipmentPlacements,
    ({ one }) => ({
        user_updatedByUserId: one(users, {
            fields: [actorEquipmentPlacements.updatedByUserId],
            references: [users.id],
            relationName: 'actorEquipmentPlacements_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [actorEquipmentPlacements.createdByUserId],
            references: [users.id],
            relationName: 'actorEquipmentPlacements_createdByUserId_users_id',
        }),
        actorItem: one(actorItems, {
            fields: [actorEquipmentPlacements.actorItemId],
            references: [actorItems.id],
        }),
        actor: one(actors, {
            fields: [actorEquipmentPlacements.actorId],
            references: [actors.id],
        }),
    })
)

export const actorItemTransfersRelations = relations(
    actorItemTransfers,
    ({ one }) => ({
        user_updatedByUserId: one(users, {
            fields: [actorItemTransfers.updatedByUserId],
            references: [users.id],
            relationName: 'actorItemTransfers_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [actorItemTransfers.createdByUserId],
            references: [users.id],
            relationName: 'actorItemTransfers_createdByUserId_users_id',
        }),
        actor_toActorId: one(actors, {
            fields: [actorItemTransfers.toActorId],
            references: [actors.id],
            relationName: 'actorItemTransfers_toActorId_actors_id',
        }),
        actor_fromActorId: one(actors, {
            fields: [actorItemTransfers.fromActorId],
            references: [actors.id],
            relationName: 'actorItemTransfers_fromActorId_actors_id',
        }),
        actorItem: one(actorItems, {
            fields: [actorItemTransfers.actorItemId],
            references: [actorItems.id],
        }),
    })
)

export const appliedEffectsRelations = relations(
    appliedEffects,
    ({ one, many }) => ({
        user_updatedByUserId: one(users, {
            fields: [appliedEffects.updatedByUserId],
            references: [users.id],
            relationName: 'appliedEffects_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [appliedEffects.createdByUserId],
            references: [users.id],
            relationName: 'appliedEffects_createdByUserId_users_id',
        }),
        actor_appliedByActorId: one(actors, {
            fields: [appliedEffects.appliedByActorId],
            references: [actors.id],
            relationName: 'appliedEffects_appliedByActorId_actors_id',
        }),
        actor_actorId: one(actors, {
            fields: [appliedEffects.actorId],
            references: [actors.id],
            relationName: 'appliedEffects_actorId_actors_id',
        }),
        appliedEffectModifiers: many(appliedEffectModifiers),
    })
)

export const appliedEffectModifiersRelations = relations(
    appliedEffectModifiers,
    ({ one }) => ({
        user_updatedByUserId: one(users, {
            fields: [appliedEffectModifiers.updatedByUserId],
            references: [users.id],
            relationName: 'appliedEffectModifiers_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [appliedEffectModifiers.createdByUserId],
            references: [users.id],
            relationName: 'appliedEffectModifiers_createdByUserId_users_id',
        }),
        appliedEffect: one(appliedEffects, {
            fields: [appliedEffectModifiers.appliedEffectId],
            references: [appliedEffects.id],
        }),
    })
)

export const actorImagesRelations = relations(actorImages, ({ one }) => ({
    user_updatedByUserId: one(users, {
        fields: [actorImages.updatedByUserId],
        references: [users.id],
        relationName: 'actorImages_updatedByUserId_users_id',
    }),
    user_createdByUserId: one(users, {
        fields: [actorImages.createdByUserId],
        references: [users.id],
        relationName: 'actorImages_createdByUserId_users_id',
    }),
    actor: one(actors, {
        fields: [actorImages.actorId],
        references: [actors.id],
    }),
}))

export const actorGenerationRecordsRelations = relations(
    actorGenerationRecords,
    ({ one }) => ({
        user_updatedByUserId: one(users, {
            fields: [actorGenerationRecords.updatedByUserId],
            references: [users.id],
            relationName: 'actorGenerationRecords_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [actorGenerationRecords.createdByUserId],
            references: [users.id],
            relationName: 'actorGenerationRecords_createdByUserId_users_id',
        }),
        campaign: one(campaigns, {
            fields: [actorGenerationRecords.campaignId],
            references: [campaigns.id],
        }),
        user_ownerUserId: one(users, {
            fields: [actorGenerationRecords.ownerUserId],
            references: [users.id],
            relationName: 'actorGenerationRecords_ownerUserId_users_id',
        }),
        actor: one(actors, {
            fields: [actorGenerationRecords.actorId],
            references: [actors.id],
        }),
    })
)

export const campaignGmsRelations = relations(campaignGms, ({ one }) => ({
    user_updatedByUserId: one(users, {
        fields: [campaignGms.updatedByUserId],
        references: [users.id],
        relationName: 'campaignGms_updatedByUserId_users_id',
    }),
    user_createdByUserId: one(users, {
        fields: [campaignGms.createdByUserId],
        references: [users.id],
        relationName: 'campaignGms_createdByUserId_users_id',
    }),
    user_userId: one(users, {
        fields: [campaignGms.userId],
        references: [users.id],
        relationName: 'campaignGms_userId_users_id',
    }),
    campaign: one(campaigns, {
        fields: [campaignGms.campaignId],
        references: [campaigns.id],
    }),
}))

export const actorItemEffectsRelations = relations(
    actorItemEffects,
    ({ one }) => ({
        user_updatedByUserId: one(users, {
            fields: [actorItemEffects.updatedByUserId],
            references: [users.id],
            relationName: 'actorItemEffects_updatedByUserId_users_id',
        }),
        user_createdByUserId: one(users, {
            fields: [actorItemEffects.createdByUserId],
            references: [users.id],
            relationName: 'actorItemEffects_createdByUserId_users_id',
        }),
        catalogArtifact: one(catalogArtifacts, {
            fields: [actorItemEffects.grantedArtifactId],
            references: [catalogArtifacts.id],
        }),
        actorItem: one(actorItems, {
            fields: [actorItemEffects.actorItemId],
            references: [actorItems.id],
        }),
    })
)
