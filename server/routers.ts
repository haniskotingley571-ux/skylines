import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  createArticle,
  getArticlesByUserId,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
  searchArticles,
  createTag,
  getTagsByUserId,
  deleteTag,
  addTagToArticle,
  removeTagFromArticle,
  getArticleStats,
  getRecentArticles,
} from "./db";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Articles router
  articles: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
      .query(({ ctx, input }) => getArticlesByUserId(ctx.user.id, input.limit, input.offset)),

    getBySlug: protectedProcedure
      .input(z.object({ slug: z.string() }))
      .query(({ ctx, input }) => getArticleBySlug(input.slug, ctx.user.id)),

    search: protectedProcedure
      .input(z.object({ query: z.string() }))
      .query(({ ctx, input }) => searchArticles(ctx.user.id, input.query)),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string().min(1),
          content: z.string(),
          excerpt: z.string().optional(),
          slug: z.string().min(1),
        })
      )
      .mutation(({ ctx, input }) =>
        createArticle({
          userId: ctx.user.id,
          title: input.title,
          content: input.content,
          excerpt: input.excerpt,
          slug: input.slug,
        })
      ),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          content: z.string().optional(),
          excerpt: z.string().optional(),
        })
      )
      .mutation(({ input }) =>
        updateArticle(input.id, {
          title: input.title,
          content: input.content,
          excerpt: input.excerpt,
        })
      ),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteArticle(input.id)),

    recent: protectedProcedure
      .input(z.object({ limit: z.number().default(5) }))
      .query(({ ctx, input }) => getRecentArticles(ctx.user.id, input.limit)),

    stats: protectedProcedure.query(({ ctx }) => getArticleStats(ctx.user.id)),
  }),

  // Tags router
  tags: router({
    list: protectedProcedure.query(({ ctx }) => getTagsByUserId(ctx.user.id)),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          slug: z.string().min(1),
          color: z.string().default("#3B82F6"),
        })
      )
      .mutation(({ ctx, input }) =>
        createTag({
          userId: ctx.user.id,
          name: input.name,
          slug: input.slug,
          color: input.color,
        })
      ),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(({ input }) => deleteTag(input.id)),

    addToArticle: protectedProcedure
      .input(z.object({ articleId: z.number(), tagId: z.number() }))
      .mutation(({ input }) => addTagToArticle(input.articleId, input.tagId)),

    removeFromArticle: protectedProcedure
      .input(z.object({ articleId: z.number(), tagId: z.number() }))
      .mutation(({ input }) => removeTagFromArticle(input.articleId, input.tagId)),
  }),
});

export type AppRouter = typeof appRouter;
