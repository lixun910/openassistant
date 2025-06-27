import fs from 'fs';
import path from 'path';

async function osmReadmeToDocsPlugin(context) {
  return {
    name: 'osm-readme-to-docs',
    async loadContent() {
      const readmePath = path.join(
        context.siteDir,
        '..',
        'packages',
        'tools',
        'osm',
        'README.md'
      );
      const docsPath = path.join(
        context.siteDir,
        'docs',
        'tools',
        'osm-plugin.md'
      );

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
sidebar_label: OSM Tools
---

${readmeContent}`;

        // Write to echarts-plugin.md
        fs.writeFileSync(docsPath, docusaurusContent);
        console.log('Successfully generated osm-plugin.md from README.md');
      } catch (error) {
        console.error('Error generating osm-plugin.md:', error);
      }
    },
  };
}

export default osmReadmeToDocsPlugin;
