import { pgTable, uuid, text, timestamp, pgEnum, jsonb, index, integer, bigint, numeric, boolean } from 'drizzle-orm/pg-core';

/* ------------------- ENUMS ------------------- */
export const subscriptionPlanEnum = pgEnum('subscription_plan', ['free', 'pro', 'go']);
export const subscriptionStatusEnum = pgEnum('subscription_status', ['active', 'cancelled', 'past_due', 'trialing', 'unpaid']);
export const formStatusEnum = pgEnum('form_status', ['active', 'completed']);
export const submissionsStatusEnum = pgEnum('submissions_status', ['pending', 'completed', 'failed']);

/* ------------------- USERS ------------------- */
export const users = pgTable('users', {
    id: uuid('id').primaryKey(), // Needs to be filled by auth.users.id
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    isSuper: boolean('is_super').default(false).notNull(),
    profilePhoto: text('profile_photo'),
    createdAt: timestamp('created_at').defaultNow(),
});

/* ------------------- SUBSCRIPTIONS ------------------- */
export const subscriptions = pgTable(
    'subscriptions',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),

        // Plan and status
        plan: subscriptionPlanEnum('plan').default('go').notNull(),
        planKey: text('plan_key').default('go').notNull(),
        status: subscriptionStatusEnum('status').default('active').notNull(),

        // Stripe integration
        stripeCustomerId: text('stripe_customer_id').unique(),
        stripeSubscriptionId: text('stripe_subscription_id').unique(),

        // Billing metadata
        subscriptionStart: timestamp('subscription_start').defaultNow(),
        subscriptionEnd: timestamp('subscription_end'),
        lastBilledAt: timestamp('last_billed_at'),
        invoiceLink: text('invoice_link'),

        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
    },
    (table) => [index('subscriptions_user_idx').on(table.userId), index('subscriptions_stripe_customer_idx').on(table.stripeCustomerId), index('subscriptions_stripe_subscription_idx').on(table.stripeSubscriptionId)]
);

/* ------------------- USAGE ------------------- */
export const usage = pgTable(
    'usage',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' })
            .unique(),
        subscriptionId: uuid('subscription_id')
            .notNull()
            .references(() => subscriptions.id, { onDelete: 'cascade' }),

        // Usage tracking fields
        storageUsedBytes: bigint('storage_used_bytes', { mode: 'number' }).default(0).notNull(),
        audioMinutesTranscribed: numeric('audio_minutes_transcribed', { precision: 10, scale: 2 }).default('0.00').notNull(),

        videoMinutesUsed: numeric('video_minutes_used', { precision: 10, scale: 2 }).default('0.00').notNull(),

        formsCreatedCount: integer('forms_created_count').default(0).notNull(),
        submissionsCount: integer('submissions_count').default(0).notNull(),

        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
    },
    (table) => [index('usage_user_idx').on(table.userId), index('usage_subscription_idx').on(table.subscriptionId)]
);

/* ------------------- LIMITS ------------------- */
export const limits = pgTable(
    'limits',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' })
            .unique(),
        subscriptionId: uuid('subscription_id').references(() => subscriptions.id, { onDelete: 'set null' }),

        // Limit fields (-1 = unlimited)
        storageLimitBytes: bigint('storage_limit_bytes', { mode: 'number' }).default(10737418240).notNull(), // 10GB
        formsLimit: integer('forms_limit').default(5).notNull(),
        submissionsLimit: integer('submissions_limit').default(20).notNull(),
        audioMinutesLimit: integer('audio_minutes_limit').default(120).notNull(),
        videoMinutesLimit: integer('video_minutes_limit').default(0).notNull(),
        videoIntelligenceEnabled: boolean('video_intelligence_enabled').default(false).notNull(),

        createdAt: timestamp('created_at').defaultNow(),
        updatedAt: timestamp('updated_at').defaultNow().notNull(),
    },
    (table) => [index('limits_user_idx').on(table.userId), index('limits_subscription_idx').on(table.subscriptionId)]
);

/* ------------------- FORMS ------------------- */
export const forms = pgTable(
    'forms',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        name: text('name').notNull(),
        submissions: integer('submissions').default(0).notNull(),
        status: formStatusEnum('status').default('active').notNull(),
        createdAt: timestamp('created_at').defaultNow(),
    },
    (table) => [index('forms_user_idx').on(table.userId)]
);

/* ------------------- SUBMISSIONS ------------------- */
export const submissions = pgTable(
    'submissions',
    {
        id: uuid('id').defaultRandom().primaryKey(),
        userId: uuid('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        formId: uuid('form_id')
            .notNull()
            .references(() => forms.id, { onDelete: 'cascade' }),
        filesSubmissionId: uuid('files_submission_id').notNull(),
        data: jsonb('data').notNull(),

        // File URLs
        videoUrl: text('video_url'), // uploaded by user
        videoUrlPath: text('video_url_path'),
        transcript: text('transcript'), // auto-generated after processing
        summary: text('summary'), // auto-generated after processing
        videoSummary: text('video_summary'), // auto-generated after processing
        jsonResultUrl: text('json_result_url'), // generated structured data
        jsonResultUrlPath: text('json_result_url_path'),
        markdownUrl: text('markdown_url'), // generated markdown summary
        markdownUrlPath: text('markdown_url_path'),
        filesSize: bigint('files_size', { mode: 'number' }).default(0).notNull(),

        // Processing state machine
        status: submissionsStatusEnum('status').default('pending'),
        errorMessage: text('error_message'),

        processedAt: timestamp('processed_at'),
        createdAt: timestamp('created_at').defaultNow(),
    },
    (table) => [index('submissions_form_idx').on(table.formId)]
);

export const contactQueries = pgTable('contact_queries', {
    id: uuid('id').defaultRandom().primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull(),
    subject: text('subject').notNull(),
    message: text('message').notNull(),
    isResolved: boolean('is_resolved').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
});
