import { existsSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { collections as staticCollections } from '../data/collections';
import { getAllEpisodes } from './rss';
import { LLM_KEYWORDS, scoreLLMRelevance, scoreTopicRelevance, topicKeywords } from './topic-keywords';

export interface CollectionRuleConfig {
  slug: string;
  threshold: number;
  keywords: string[];
}

// Map collection slugs -> keyword lists + thresholds reused from the analysis script
const COLLECTION_RULES: Record<string, CollectionRuleConfig> = {
  'building-with-llms': { slug: 'building-with-llms', threshold: 1, keywords: LLM_KEYWORDS },
  'ai-ml': { slug: 'ai-ml', threshold: 6, keywords: topicKeywords['ai-ml'] },
  typescript: { slug: 'typescript', threshold: 6, keywords: topicKeywords['typescript'] },
  accessibility: { slug: 'accessibility', threshold: 4, keywords: topicKeywords['accessibility'] },
  css: { slug: 'css', threshold: 6, keywords: topicKeywords['css'] },
  testing: { slug: 'testing', threshold: 6, keywords: topicKeywords['testing'] }
};

function scoreForCollection(slug: string, text: string): number {
  if (slug === 'building-with-llms') return scoreLLMRelevance(text);
  const rule = COLLECTION_RULES[slug];
  if (!rule) return 0;
  return scoreTopicRelevance(text, rule.keywords);
}

export async function getComputedCollections() {
  const allEpisodes = await getAllEpisodes();

  // Map episode number -> episode data (only numeric episode numbers have transcripts)
  const epByNumber = new Map<string, { slug: string; title: string }>();
  for (const ep of allEpisodes) {
    if (ep.episodeNumber && ep.episodeNumber !== 'Bonus') {
      epByNumber.set(ep.episodeNumber, { slug: ep.episodeSlug, title: ep.title });
    }
  }

  // Load transcripts
  const transcriptsDir = join(process.cwd(), 'src/content/transcripts');
  const transcriptFiles = existsSync(transcriptsDir)
    ? readdirSync(transcriptsDir).filter((f) => f.endsWith('.md'))
    : [];

  const transcriptTextBySlug = new Map<string, string>();
  for (const file of transcriptFiles) {
    const epNum = file.replace('.md', '');
    const ep = epByNumber.get(epNum);
    if (!ep) continue;
    const filePath = join(transcriptsDir, file);
    if (!existsSync(filePath)) continue;
    try {
      const text = readFileSync(filePath, 'utf-8');
      transcriptTextBySlug.set(ep.slug, text);
    } catch {
      // ignore read errors; just skip
    }
  }

  // Build a working set per collection
  const membership = new Map<string, Set<string>>();
  for (const col of staticCollections) {
    membership.set(col.slug, new Set(col.episodeSlugs));
  }

  // Augment membership based on transcript matches
  for (const [epSlug, text] of transcriptTextBySlug.entries()) {
    for (const col of staticCollections) {
      const rule = COLLECTION_RULES[col.slug];
      if (!rule) continue; // only auto-augment known rule-backed collections
      const score = scoreForCollection(col.slug, text);
      if (score >= rule.threshold) {
        membership.get(col.slug)!.add(epSlug);
      }
    }
  }

  // Emit the augmented collections array, preserving order and other metadata
  return staticCollections.map((col) => ({
    ...col,
    episodeSlugs: Array.from(membership.get(col.slug)!).sort()
  }));
}
