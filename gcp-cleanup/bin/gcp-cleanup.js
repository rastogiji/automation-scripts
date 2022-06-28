#!/usr/bin/env node

const commander = require("commander");
const program = new commander.Command();
const pkg = require("../package.json");
const instanceDelete = require("../commands/instanceDelete");
const instanceStop = require("../commands/instanceStop");
const diskDelete = require("../commands/diskDelete");

program.version(pkg.version);

const compute = program
  .command("compute")
  .description("Cleanup of Compute Engine Resources");

// gcp-cleaner compute instances
const instances = compute
  .command("instances")
  .description("Cleaning Up for Compute Engine Instances");

// gcp-cleaner compute instances delete --hour 12
instances
  .command("delete")
  .description("Deletes Long Running Compute Engine Instances")
  .option(
    "--hour <value>",
    "Specify Instance Runtime in hours before being Deleted. Defaults to 24 hours"
  )
  .action((options) => {
    instanceDelete(options);
  });

// gcp-cleaner compute instances stop --hour 12
instances
  .command("stop")
  .description("Stops Long Running Compute Engine Instances")
  .option(
    "--hour <value>",
    "Specify Instance Runtime in hours before being Stopped. Defaults to 24 hours",
    "24"
  )
  .action((options) => {
    instanceStop(options);
  });

// gcp-cleaner compute disks
const disks = compute
  .command("disks")
  .description("Cleaning Up Unattached compute Engine Disks");

// gcp-cleaner compute disks delete
disks
  .command("delete")
  .description("Delete Unattached Disks")
  .action(diskDelete);
program.parse(process.argv);