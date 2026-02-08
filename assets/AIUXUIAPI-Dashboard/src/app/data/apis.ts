export interface ApiProject {
  id: string;
  name: string;
  focus: string;
  description: string;
  tech: string[];
  showcase: string;
  status: 'online' | 'degraded' | 'offline';
  latency: number;
  uptime: number;
}

export interface ApiCategory {
  id: string;
  name: string;
  projects: ApiProject[];
}

export const apiCategories: ApiCategory[] = [
  {
    id: 'api-design',
    name: 'API Design & Developer Experience',
    projects: [
      {
        id: 'public-first-docs',
        name: 'Public-First Open API Documentation Portal',
        focus: 'UX for developers',
        description: 'A custom documentation site for a fictional SaaS with high-quality guides and interactive code snippets.',
        tech: ['Redocly', 'Docusaurus', 'OpenAPI 3.0', 'Spectral linting'],
        showcase: 'High-quality "Getting Started" guides, clear error code mapping, and interactive code snippets.',
        status: 'online',
        latency: 45,
        uptime: 99.9,
      },
      {
        id: 'chaos-gateway',
        name: 'API Gateway with Chaos Engineering UI',
        focus: 'QA and Resilience',
        description: 'A dashboard that lets users toggle latency or status code errors on a live API.',
        tech: ['Kong', 'Tyk', 'React', 'Express proxy'],
        showcase: 'How your UI handles "graceful degradation" when an API slows down or fails.',
        status: 'degraded',
        latency: 320,
        uptime: 97.2,
      }
    ]
  },
  {
    id: 'ai-llm',
    name: 'AI & LLM Methodologies',
    projects: [
      {
        id: 'prompt-injection-tester',
        name: 'LLM Prompt Injection Security Tester',
        focus: 'AI QA and Security',
        description: 'An automated tool that sends adversarial prompts to an LLM API to test system instruction resilience.',
        tech: ['Python', 'OpenAI API', 'LangChain', 'Pytest'],
        showcase: 'A report dashboard showing which "jailbreaks" succeeded vs. failed.',
        status: 'online',
        latency: 1250,
        uptime: 98.5,
      },
      {
        id: 'rag-latency-monitor',
        name: 'RAG Latency Monitor',
        focus: 'Monitoring and AI Performance',
        description: 'Monitors the time it takes for vector database to fetch context versus LLM generation time.',
        tech: ['Pinecone', 'LangChain', 'Prometheus', 'Grafana'],
        showcase: 'Visualizing "Time to First Token" and impact of context size on UX.',
        status: 'online',
        latency: 890,
        uptime: 99.1,
      }
    ]
  },
  {
    id: 'qa-automation',
    name: 'Advanced QA & Automation',
    projects: [
      {
        id: 'visual-regression',
        name: 'Visual Regression for API-Driven UI',
        focus: 'UI/QA Integration',
        description: 'Triggers UI screenshot comparison whenever an API schema change is detected.',
        tech: ['Playwright', 'Applitools', 'GitHub Actions'],
        showcase: 'How schema changes (e.g., field becoming null) impact actual layout.',
        status: 'online',
        latency: 780,
        uptime: 99.6,
      },
      {
        id: 'contract-guardian',
        name: 'The Contract Guardian',
        focus: 'QA and Team Collaboration',
        description: 'A CI/CD pipeline using Contract Testing to ensure Frontend and Backend never drift apart.',
        tech: ['Pact.io', 'Postman API Governance'],
        showcase: 'Preventing "breaking changes" before they hit staging.',
        status: 'online',
        latency: 125,
        uptime: 99.8,
      }
    ]
  },
  {
    id: 'monitoring-ux',
    name: 'Monitoring & Real-Time UX',
    projects: [
      {
        id: 'api-health-hud',
        name: 'Real-Time API Health HUD',
        focus: 'UX and Monitoring',
        description: 'A heads-up display that translates complex JSON status logs into human-readable health scores.',
        tech: ['WebSockets', 'Socket.io', 'Tailwind CSS'],
        showcase: 'Transforming technical metrics into actionable business insights.',
        status: 'online',
        latency: 28,
        uptime: 99.9,
      },
      {
        id: 'synthetic-user-flow',
        name: 'Synthetic User Flow Monitor',
        focus: 'QA and UX-flow validation',
        description: 'Mimics user journey (Login → Add to Cart → Checkout) strictly via API calls.',
        tech: ['k6', 'Newman', 'Postman'],
        showcase: 'Performance testing for critical business paths.',
        status: 'degraded',
        latency: 450,
        uptime: 96.8,
      }
    ]
  },
  {
    id: 'specialized-tooling',
    name: 'Specialized Tooling',
    projects: [
      {
        id: 'ai-mock-generator',
        name: 'AI-Powered Mock Data Generator',
        focus: 'AI and Developer Tooling',
        description: 'A UI where users describe a scenario and an LLM generates a mock API endpoint with that data.',
        tech: ['OpenAI API', 'Next.js', 'JSON Server'],
        showcase: 'Using AI to speed up QA data setup process.',
        status: 'online',
        latency: 2100,
        uptime: 98.2,
      },
      {
        id: 'graphql-query-cost',
        name: 'GraphQL Query Cost Calculator',
        focus: 'API Design and Performance',
        description: 'Analyzes a GraphQL query and predicts performance impact/cost before execution.',
        tech: ['Apollo Server', 'GraphQL Shield'],
        showcase: 'Protecting backend from malicious deeply nested queries.',
        status: 'online',
        latency: 95,
        uptime: 99.7,
      },
      {
        id: 'offline-sync-tester',
        name: 'Offline-First Sync Tester',
        focus: 'UX and Mobile/Web QA',
        description: 'Demo showing how UI handles API synchronization when user toggles "Airplane Mode."',
        tech: ['Service Workers', 'IndexedDB', 'Axios interceptors'],
        showcase: 'Robust error handling and data reconciliation UI.',
        status: 'offline',
        latency: 0,
        uptime: 85.3,
      },
      {
        id: 'a11y-api-auditor',
        name: 'Accessibility API Auditor',
        focus: 'UX and A11y',
        description: 'Automated tool checking if API responses include necessary metadata for screen readers.',
        tech: ['Node.js', 'JSON-schema validator'],
        showcase: 'Ensuring accessibility starts at the data layer, not just the CSS layer.',
        status: 'online',
        latency: 65,
        uptime: 99.4,
      }
    ]
  }
];

// Mock historical data for graphs
export const generateHistoricalData = (baseLatency: number, points: number = 20) => {
  return Array.from({ length: points }, (_, i) => ({
    time: `${i * 5}s`,
    latency: Math.max(0, baseLatency + Math.random() * 100 - 50),
    requests: Math.floor(Math.random() * 1000) + 500,
    errors: Math.floor(Math.random() * 50)
  }));
};
