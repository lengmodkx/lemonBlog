export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  language: string | null;
  stargazersCount: number;
  forksCount: number;
  updatedAt: string;
  createdAt: string;
}

const GITHUB_USERNAME = 'lengmodkx';

export async function getGitHubProjects(): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=20`,
      {
        next: { revalidate: 3600 },
        headers: {
          Accept: 'application/vnd.github+json',
        },
      }
    );

    if (!res.ok) {
      console.error('GitHub API error:', res.status, await res.text());
      return [];
    }

    const data = await res.json();

    return data
      .filter((repo: { fork: boolean; name: string }) => !repo.fork && repo.name !== GITHUB_USERNAME)
      .map((repo: {
        id: number;
        name: string;
        full_name: string;
        description: string | null;
        html_url: string;
        language: string | null;
        stargazers_count: number;
        forks_count: number;
        updated_at: string;
        created_at: string;
      }) => ({
        id: repo.id,
        name: repo.name,
        fullName: repo.full_name,
        description: repo.description,
        htmlUrl: repo.html_url,
        language: repo.language,
        stargazersCount: repo.stargazers_count,
        forksCount: repo.forks_count,
        updatedAt: repo.updated_at,
        createdAt: repo.created_at,
      }));
  } catch (error) {
    console.error('Failed to fetch GitHub projects:', error);
    return [];
  }
}
