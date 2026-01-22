export const LLM_KEYWORDS = [
  'llm',
  'large language model',
  'language model',
  'gpt',
  'openai',
  'claude',
  'anthropic',
  'agent',
  'agentic',
  'workflow',
  'ai agent',
  'langchain',
  'langgraph',
  'llamaindex',
  'autogen',
  'crewai',
  'framework',
  'tool',
  'prompt engineering',
  'fine-tuning',
  'rag',
  'retrieval augmented',
  'vector database',
  'embeddings',
  'semantic search',
  'ai application',
  'ai tool',
  'ai framework',
  'ai library',
  'ai sdk',
  'ai platform',
  'ai service',
  'ai api',
  'ai model',
  'transformer',
  'neural network',
  'machine learning',
  'deep learning',
  'natural language processing',
  'nlp',
  'chatbot',
  'assistant',
  'copilot',
  'ai coding',
  'code generation',
  'ai development',
  'ai engineering'
];

export const topicKeywords: Record<string, string[]> = {
  react: ['react', 'jsx', 'component', 'hooks', 'next.js', 'remix', 'gatsby'],
  vue: ['vue', 'nuxt', 'vuex', 'pinia', 'composition api'],
  angular: ['angular', 'typescript', 'rxjs', 'ngrx'],
  svelte: ['svelte', 'sveltekit', 'svelte store'],
  typescript: ['typescript', 'ts', 'type system', 'generics', 'interface'],
  testing: ['test', 'testing', 'jest', 'vitest', 'cypress', 'playwright', 'tdd', 'bdd', 'unit test', 'e2e'],
  css: ['css', 'tailwind', 'styled-components', 'sass', 'scss', 'css-in-js', 'styling'],
  performance: ['performance', 'optimization', 'lighthouse', 'core web vitals', 'bundle size', 'lazy loading'],
  security: ['security', 'authentication', 'authorization', 'oauth', 'jwt', 'encryption', 'xss', 'csrf', 'sql injection'],
  devops: ['devops', 'ci/cd', 'docker', 'kubernetes', 'github actions', 'deployment', 'infrastructure'],
  database: ['database', 'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'prisma', 'drizzle', 'orm'],
  api: ['api', 'rest', 'graphql', 'rpc', 'endpoint', 'fetch', 'axios'],
  webassembly: ['webassembly', 'wasm', 'rust', 'go', 'assemblyscript'],
  'ai-ml': ['ai', 'artificial intelligence', 'machine learning', 'ml', 'neural network', 'deep learning', 'tensorflow', 'pytorch', 'model'],
  accessibility: ['accessibility', 'a11y', 'aria', 'screen reader', 'wcag', 'semantic html'],
  mobile: ['mobile', 'responsive', 'pwa', 'progressive web app', 'ios', 'android', 'react native'],
  architecture: ['architecture', 'design pattern', 'microservices', 'monolith', 'scalability', 'system design']
};

export function scoreTopicRelevance(text: string, keywords: string[]): number {
  const lowerText = text.toLowerCase();
  let score = 0;
  for (const keyword of keywords) {
    const regex = new RegExp(keyword.toLowerCase(), 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      score += matches.length * 2;
    }
  }
  return score;
}

export function scoreLLMRelevance(text: string): number {
  return scoreTopicRelevance(text, LLM_KEYWORDS);
}
