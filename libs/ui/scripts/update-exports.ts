#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR: string = path.join(__dirname, '..', 'src', 'components');
const MAIN_INDEX_FILE: string = path.join(
  __dirname,
  '..',
  'src',
  'components',
  'index.ts'
);

/**
 * Get all TypeScript component files from the components directory
 */
function getComponentFiles(): string[] {
  if (!fs.existsSync(COMPONENTS_DIR)) {
    console.warn('Components directory does not exist:', COMPONENTS_DIR);
    return [];
  }

  return fs
    .readdirSync(COMPONENTS_DIR)
    .filter((file: string) => file.endsWith('.tsx') || file.endsWith('.ts'))
    .filter(
      (file: string) =>
        !file.includes('.spec.') &&
        !file.includes('.test.') &&
        file !== 'index.ts'
    );
}

/**
 * Generate barrel export statements for the main index file
 */
function generateMainIndexExports(componentFiles: string[]): string {
  const exports: string[] = [];

  // Add individual component exports
  componentFiles.forEach((fileName: string) => {
    const componentName = path.parse(fileName).name;
    exports.push(`export * from './${componentName}';`);
  });

  const exportsContent = exports.sort().join('\n');
  return `// This file is auto-generated. Do not edit manually.\n// Run 'nx run ui:update-exports' to regenerate.\n\n${exportsContent}\n`;
}

/**
 * Update imports in a component file to use relative imports
 */
function updateImportsInFile(filePath: string): boolean {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;
    let hasChanges = false;

    // Regular expression to match @betterdocs/ui/[component-name] imports
    const packageImportRegex = /from\s+["']@betterdocs\/ui\/([^"']+)["']/g;

    let match;

    // Handle @betterdocs/ui imports
    while ((match = packageImportRegex.exec(content)) !== null) {
      const componentName = match[1];
      const fullMatch = match[0];

      // Replace with relative import
      const relativeImport = `from "./${componentName}"`;
      updatedContent = updatedContent.replace(fullMatch, relativeImport);
      hasChanges = true;

      console.log(
        `  ✔ Updated import: @betterdocs/ui/${componentName} → ./${componentName}`
      );
    }

    if (hasChanges) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
    }

    return hasChanges;
  } catch (error) {
    console.error(
      `× Error processing file ${filePath}:`,
      error instanceof Error ? error.message : String(error)
    );
    return false;
  }
}

/**
 * Update all component files to use relative imports instead of package/alias imports
 */
function updateComponentImports(): void {
  try {
    const componentFiles = getComponentFiles();

    if (componentFiles.length === 0) {
      console.log('No component files found to update');
      return;
    }

    console.log(
      `\nUpdating imports in ${componentFiles.length} component files...\n`
    );

    let totalUpdatedFiles = 0;

    componentFiles.forEach((fileName: string) => {
      const filePath = path.join(COMPONENTS_DIR, fileName);
      console.log(`Processing: ${fileName}`);

      const hasChanges = updateImportsInFile(filePath);
      if (hasChanges) {
        totalUpdatedFiles++;
      } else {
        console.log('  ✓ No @betterdocs/ui imports found');
      }
    });

    console.log(
      `\n✅ Import updates completed! Updated ${totalUpdatedFiles} files with relative imports.`
    );
  } catch (error) {
    console.error(
      '× Error updating component imports:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

/**
 * Update the main src/index.ts file with re-exports
 */
function updateMainIndexFile(): void {
  try {
    const componentFiles = getComponentFiles();

    if (componentFiles.length === 0) {
      console.log('No components found to export');
      return;
    }

    const exportContent = generateMainIndexExports(componentFiles);

    // Write the updated content
    fs.writeFileSync(MAIN_INDEX_FILE, exportContent, 'utf8');

    console.log(`\n✅ Main index.ts updated with exports:`);
    if (componentFiles.length > 0) {
      console.log(`   - ${componentFiles.length} components:`);
      componentFiles.slice(0, 5).forEach((fileName: string) => {
        const componentName = path.parse(fileName).name;
        console.log(`     - ${componentName}`);
      });
      if (componentFiles.length > 5) {
        console.log(`     - ... and ${componentFiles.length - 5} more`);
      }
    }
  } catch (error) {
    console.error(
      '× Error updating main index.ts:',
      error instanceof Error ? error.message : String(error)
    );
    process.exit(1);
  }
}

/**
 * Main execution function that runs both tasks
 */
function runUpdateExports(): void {
  console.log('🔄 Starting export updates...\n');

  // Step 1: Update component imports to use relative paths
  updateComponentImports();

  // Step 2: Update main index.ts file with re-exports
  updateMainIndexFile();

  console.log('\n🎉 All export updates completed successfully!');
}

// Run the script
runUpdateExports();
