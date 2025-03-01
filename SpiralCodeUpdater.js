import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import chalk from 'chalk';
import inquirer from 'inquirer';
import ora from 'ora';

// Color formatting functions
const format = {
  // Process stages
  header: (text) => chalk.cyan.bold(`\n=== ${text} ===`),
  section: (text) => chalk.magenta(`\n${text}`),
  filePath: (text) => chalk.blue(text),
  dirPath: (text) => chalk.blue.bold(text),
  
  // Status messages
  creating: (text) => chalk.yellow(text),
  processing: (text) => chalk.blue(text),
  checking: (text) => chalk.cyan(text),
  validating: (text) => chalk.magenta(text),
  
  // Results
  success: (text) => chalk.green(`✓ ${text}`),
  warning: (text) => chalk.yellow(`⚠ ${text}`),
  error: (text) => chalk.red(`✗ ${text}`),
  skipped: (text) => chalk.gray(`• ${text}`),
  
  // Progress indicators
  mainOp: (text) => chalk.cyan(text),
  fileOp: (text) => chalk.blue(text),
  validateOp: (text) => chalk.magenta(text)
};

class SpiralCodeUpdater {
  constructor(patchFile = 'patches.json') {
    this.patchFile = patchFile;
    this.baseDir = process.cwd();
    this.logDir = path.join(this.baseDir, 'logs');
    this.timestamp = this.formatTimestamp(new Date());
    
    // Ensure log directory exists
    fs.ensureDirSync(this.logDir);
    
    // Initialize logging
    this.initializeLogging();
    
    // Validate patch file and git repository
    if (!fs.existsSync(this.patchFile)) {
      this.logError(`Patch file ${this.patchFile} not found`);
      throw new Error(`Patch file ${this.patchFile} not found`);
    }

    this.validateGitRepository();

    // Read and preprocess patches
    const patchData = JSON.parse(fs.readFileSync(this.patchFile, 'utf8'));
    this.patches = this.preprocessPatches(patchData);
  }

  formatTimestamp(date) {
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('en', { month: 'short' }).toUpperCase();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}${month}${hours}${minutes}`;
  }

  initializeLogging() {
    this.logFile = path.join(this.logDir, `spiral-update-${this.timestamp}.log`);
    this.changelogFile = path.join(this.logDir, 'changelog.json');
    
    // Initialize or load changelog
    if (fs.existsSync(this.changelogFile)) {
      this.changelog = JSON.parse(fs.readFileSync(this.changelogFile, 'utf8'));
    } else {
      this.changelog = [];
    }
  }

  logMessage(message, type = 'info') {
    const entry = {
      timestamp: new Date().toISOString(),
      type,
      message
    };
    
    // Add to current session log
    fs.appendFileSync(this.logFile, JSON.stringify(entry) + '\n');
    
    // Console output with colors
    const color = {
      info: 'blue',
      success: 'green',
      warning: 'yellow',
      error: 'red'
    }[type] || 'white';
    
    console.log(chalk[color](message));
  }

  logError(message) {
    this.logMessage(message, 'error');
  }

  async confirmPatchExecution() {
    const patchSummary = this.patches.map(patch => {
      if (patch.action === 'delete') {
        return chalk.red(`DELETE: ${patch.file}`);
      } else {
        return chalk.yellow(`UPDATE: ${patch.file}`);
      }
    }).join('\n');

    console.log(chalk.cyan('\nPatch Summary:'));
    console.log(patchSummary);
    console.log('\n');

    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: chalk.yellow('Do you want to proceed with these changes?'),
      default: false
    }]);

    return confirm;
  }

  preprocessPatches(patchData) {
    if (!patchData || !patchData.patches || !Array.isArray(patchData.patches)) {
      throw new Error('Invalid patch file format. Expected { patches: [] }');
    }
    return patchData.patches;
  }

  validateGitRepository() {
    try {
      execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
      this.logMessage('Git repository validated', 'info');
    } catch (error) {
      this.logError('Not a git repository');
      throw new Error('Not a git repository');
    }
  }

  createGitBackup() {
    const branchName = `backup/spiral-update-${this.timestamp}`;
    execSync(`git checkout -b ${branchName}`);
    execSync('git add .');
    const commitMessage = `Backup before ${this.patchFile} on ${this.timestamp}`;
    execSync(`git commit -m "${commitMessage}"`);
    const commitHash = execSync('git rev-parse HEAD').toString().trim();
    console.log(chalk.green(`Created backup branch: ${branchName}`));
    return { commitHash, commitMessage, branchName };
  }

  async applyPatches() {
    try {
      console.log(format.header('Patch Application Process'));
      
      const spinner = ora({
        text: format.mainOp('Creating Git backup...'),
        color: 'yellow'
      }).start();
      
      const gitBackup = this.createGitBackup();
      spinner.succeed(format.success('Git backup created successfully'));
      
      const results = {
        timestamp: new Date().toISOString(),
        patchFile: this.patchFile,
        gitBackup: {
          commitHash: gitBackup.commitHash,
          commitMessage: gitBackup.commitMessage
        },
        patches: {
          total: this.patches.length,
          success: 0,
          fail: 0
        },
        fileChanges: {
          updated: 0,
          added: 0,
          deleted: 0,
          total: this.patches.length
        },
        details: []
      };

      console.log(format.section(`Processing ${this.patches.length} patches:`));
      
      for (const patch of this.patches) {
        const actionSpinner = ora({
          text: format.processing(`Processing ${format.filePath(patch.file)}...`),
          color: 'blue'
        }).start();
        
        try {
          const filePath = path.join(this.baseDir, patch.file);
          const dirPath = path.dirname(filePath);
          
          if (patch.action !== 'delete') {
            await fs.ensureDir(dirPath);
            actionSpinner.text = format.creating(`Creating directory structure for ${format.dirPath(dirPath)}...`);
          }
          
          if (patch.action === 'delete') {
            actionSpinner.text = format.checking(`Checking if ${format.filePath(patch.file)} exists...`);
            if (await fs.pathExists(filePath)) {
              actionSpinner.text = format.processing(`Deleting ${format.filePath(patch.file)}...`);
              await fs.remove(filePath);
              results.fileChanges.deleted++;
              actionSpinner.succeed(format.success(`Deleted ${format.filePath(patch.file)}`));
            } else {
              actionSpinner.info(format.skipped(`File ${format.filePath(patch.file)} does not exist, skipping deletion`));
            }
          } else {
            actionSpinner.text = format.validating(`Validating content for ${format.filePath(patch.file)}...`);
            
            if (!patch.content) {
              throw new Error('No content provided for file update');
            }
            
            const exists = await fs.pathExists(filePath);
            actionSpinner.text = format.processing(`${exists ? 'Updating' : 'Creating'} ${format.filePath(patch.file)}...`);
            
            await fs.writeFile(filePath, patch.content, 'utf8');
            
            if (exists) {
              results.fileChanges.updated++;
              actionSpinner.succeed(format.success(`Updated ${format.filePath(patch.file)}`));
            } else {
              results.fileChanges.added++;
              actionSpinner.succeed(format.success(`Created ${format.filePath(patch.file)}`));
            }
          }
          
          results.patches.success++;
          results.details.push({
            file: patch.file,
            status: 'success',
            action: patch.action
          });
        } catch (error) {
          results.patches.fail++;
          results.details.push({
            file: patch.file,
            status: 'error',
            action: patch.action,
            error: error.message
          });
          
          actionSpinner.fail(format.error(`Failed to process ${format.filePath(patch.file)}: ${error.message}`));
          this.logError(`Failed to process ${patch.file}: ${error.message}`);
        }
      }
      
      // Update changelog
      this.changelog.push(results);
      await fs.writeFile(this.changelogFile, JSON.stringify(this.changelog, null, 2));
      
      console.log(format.header('Patch Application Summary'));
      console.log(format.section('File Changes:'));
      console.log(format.success(`Added: ${results.fileChanges.added}`));
      console.log(format.success(`Updated: ${results.fileChanges.updated}`));
      console.log(format.warning(`Deleted: ${results.fileChanges.deleted}`));
      console.log(format.section('Patch Results:'));
      console.log(format.success(`Successful: ${results.patches.success}`));
      console.log(format.error(`Failed: ${results.patches.fail}`));
      
      return results;
    } catch (error) {
      this.logError(`Patch application failed: ${error.message}`);
      throw error;
    }
  }
}

// Main execution
const patchFile = process.argv[2] || 'patches.json';

async function main() {
  try {
    const updater = new SpiralCodeUpdater(patchFile);
    const shouldProceed = await updater.confirmPatchExecution();
    
    if (shouldProceed) {
      await updater.applyPatches();
    } else {
      console.log(chalk.yellow('Patch application cancelled by user'));
    }
  } catch (error) {
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

main();

export default SpiralCodeUpdater;
