import fs from 'fs';
import path from 'path';

async function duckdbReadmeToDocsPlugin(context) {
  return {
    name: 'duckdb-readme-to-docs',
    async loadContent() {
      const readmePath = path.join(context.siteDir, '..', 'packages', 'tools', 'duckdb', 'README.md');
      const docsPath = path.join(context.siteDir, 'docs', 'tools', 'duckdb-plugin.md');

      try {
        // Create the docs/tools directory if it doesn't exist
        const docsDir = path.dirname(docsPath);
        if (!fs.existsSync(docsDir)) {
          fs.mkdirSync(docsDir, { recursive: true });
        }

        // Read the content of README.md
        const readmeContent = fs.readFileSync(readmePath, 'utf8');

        // Add Docusaurus frontmatter
        const docusaurusContent = `---
sidebar_position: 2
sidebar_label: SQL Tools
---

${readmeContent}`;

        // Write to echarts-plugin.md
        fs.writeFileSync(docsPath, docusaurusContent);
        console.log('Successfully generated duckdb-plugin.md from README.md');
      } catch (error) {
        console.error('Error generating duckdb-plugin.md:', error);
      }
    },
  };
}

export default duckdbReadmeToDocsPlugin; 